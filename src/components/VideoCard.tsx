import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import toast from "react-hot-toast";

export interface Post {
  _id: Id<"posts">;
  username: string;
  prompt: string;
  videoUrl?: string;
  status: "generating" | "completed" | "failed";
  likes: number;
  hasLiked: boolean;
  createdAt: number;
  userId: Id<"users">;
}

const SHADOW_COLORS = ["#FF1744", "#00E676", "#00B0FF", "#FFEA00", "#E040FB"];

export function VideoCard({ post, index }: { post: Post; index: number }) {
  const [isLiking, setIsLiking] = useState(false);
  const shadowColor = SHADOW_COLORS[index % SHADOW_COLORS.length];

  const toggleLike = useMutation(api.posts.toggleLike);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await toggleLike({ postId: post._id });
    } catch {
      toast.error("Couldn't like that");
    } finally {
      setIsLiking(false);
    }
  };

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <article
      className="bg-white border-4 border-black p-4 md:p-5 transform transition-transform hover:-translate-y-1"
      style={{
        boxShadow: `8px 8px 0px 0px ${shadowColor}`,
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 md:w-12 md:h-12 border-3 border-black flex items-center justify-center text-lg md:text-xl font-black"
          style={{
            backgroundColor: shadowColor,
            fontFamily: "'Archivo Black', sans-serif",
          }}
        >
          {post.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-black text-base md:text-lg truncate"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            @{post.username}
          </p>
          <p
            className="text-xs text-black/50 font-medium"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            {timeAgo(post.createdAt)}
          </p>
        </div>
      </div>

      {/* Prompt */}
      <p
        className="text-sm md:text-base font-medium mb-4 bg-[#FFFDE7] px-3 py-2 border-2 border-black/20"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        "{post.prompt}"
      </p>

      {/* Video Area */}
      <div className="aspect-video border-4 border-black bg-black relative overflow-hidden">
        {post.status === "generating" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#FF1744] via-[#E040FB] to-[#00B0FF] animate-gradient-shift">
            <div className="relative">
              <div className="text-6xl md:text-8xl animate-bounce">🎬</div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#FFEA00] rounded-full animate-ping" />
            </div>
            <p
              className="mt-4 text-white text-sm md:text-base font-black px-4 py-2 bg-black/50 border-2 border-white"
              style={{ fontFamily: "'Archivo Black', sans-serif" }}
            >
              GENERATING VIDEO...
            </p>
            <p
              className="mt-2 text-white/70 text-xs"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              This takes about 1-2 minutes
            </p>
          </div>
        )}

        {post.status === "failed" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a1a]">
            <div className="text-5xl md:text-6xl mb-3">😢</div>
            <p
              className="text-white text-sm md:text-base font-bold px-4 py-2 bg-[#FF1744] border-2 border-white"
              style={{ fontFamily: "'Archivo Black', sans-serif" }}
            >
              GENERATION FAILED
            </p>
            <p
              className="mt-2 text-white/50 text-xs text-center px-4"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Try creating a new video with a different prompt
            </p>
          </div>
        )}

        {post.status === "completed" && post.videoUrl && (
          <video
            src={post.videoUrl}
            controls
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        )}

        {post.status === "completed" && !post.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
            <p
              className="text-white/50 text-sm"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Video unavailable
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 px-4 py-2 border-3 border-black font-bold text-sm transition-all hover:-translate-y-0.5 ${
            post.hasLiked
              ? "bg-[#FF1744] text-white shadow-[3px_3px_0px_0px_#000]"
              : "bg-white shadow-[3px_3px_0px_0px_#FF1744] hover:bg-[#FF1744] hover:text-white"
          }`}
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          <span className={post.hasLiked ? "animate-pulse" : ""}>
            {post.hasLiked ? "❤️" : "🤍"}
          </span>
          <span>{post.likes}</span>
        </button>

        <div
          className="ml-auto text-xs text-black/40 font-medium"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          #{post._id.slice(-6).toUpperCase()}
        </div>
      </div>
    </article>
  );
}
