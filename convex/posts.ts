import { query, mutation, action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";

// Get all posts for the feed (most recent first)
export const listFeed = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_created")
      .order("desc")
      .take(50);

    const userId = await getAuthUserId(ctx);

    // Get like status for current user
    const postsWithLikeStatus = await Promise.all(
      posts.map(async (post) => {
        let hasLiked = false;
        if (userId) {
          const like = await ctx.db
            .query("likes")
            .withIndex("by_user_post", (q) =>
              q.eq("userId", userId).eq("postId", post._id)
            )
            .first();
          hasLiked = !!like;
        }

        // Get fresh video URL if we have a storage ID
        let videoUrl = post.videoUrl;
        if (post.videoStorageId) {
          videoUrl = await ctx.storage.getUrl(post.videoStorageId) ?? undefined;
        }

        return {
          ...post,
          videoUrl,
          hasLiked,
        };
      })
    );

    return postsWithLikeStatus;
  },
});

// Get posts by current user
export const myPosts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Get fresh video URLs
    return Promise.all(
      posts.map(async (post) => {
        let videoUrl = post.videoUrl;
        if (post.videoStorageId) {
          videoUrl = await ctx.storage.getUrl(post.videoStorageId) ?? undefined;
        }
        return { ...post, videoUrl, hasLiked: false };
      })
    );
  },
});

// Create a new post (starts video generation)
export const create = mutation({
  args: { prompt: v.string(), username: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const postId = await ctx.db.insert("posts", {
      userId,
      username: args.username,
      prompt: args.prompt,
      status: "generating",
      likes: 0,
      createdAt: Date.now(),
    });

    return postId;
  },
});

// Internal mutation to update post with video
export const updatePostWithVideo = internalMutation({
  args: {
    postId: v.id("posts"),
    videoStorageId: v.id("_storage"),
    videoUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.postId, {
      videoStorageId: args.videoStorageId,
      videoUrl: args.videoUrl,
      status: "completed",
    });
  },
});

// Internal mutation to mark post as failed
export const markPostFailed = internalMutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.postId, {
      status: "failed",
    });
  },
});

// Action to generate video and update post
export const generateVideoForPost = action({
  args: { postId: v.id("posts"), prompt: v.string() },
  handler: async (ctx, args) => {
    try {
      // Enhance prompt for Pixar-style kid-friendly content
      const enhancedPrompt = `Pixar-style 3D animated scene: ${args.prompt}. Bright colors, friendly characters, smooth animation, suitable for children, cute and whimsical style.`;

      const result = await ctx.runAction(api.ai.generateVideo, {
        prompt: enhancedPrompt,
        aspectRatio: "16:9",
      });

      if (result && result.storageId && result.url) {
        await ctx.runMutation(internal.posts.updatePostWithVideo, {
          postId: args.postId,
          videoStorageId: result.storageId,
          videoUrl: result.url,
        });
      } else {
        await ctx.runMutation(internal.posts.markPostFailed, {
          postId: args.postId,
        });
      }
    } catch (error) {
      console.error("Video generation failed:", error);
      await ctx.runMutation(internal.posts.markPostFailed, {
        postId: args.postId,
      });
    }
  },
});

// Toggle like on a post
export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_user_post", (q) =>
        q.eq("userId", userId).eq("postId", args.postId)
      )
      .first();

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.postId, { likes: Math.max(0, post.likes - 1) });
      return false;
    } else {
      await ctx.db.insert("likes", { postId: args.postId, userId });
      await ctx.db.patch(args.postId, { likes: post.likes + 1 });
      return true;
    }
  },
});

// Delete a post
export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    if (post.userId !== userId) throw new Error("Not authorized");

    // Delete associated likes
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    // Delete video from storage if exists
    if (post.videoStorageId) {
      await ctx.storage.delete(post.videoStorageId);
    }

    await ctx.db.delete(args.postId);
  },
});
