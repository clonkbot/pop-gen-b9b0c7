import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { VideoCard, Post } from "./VideoCard";

export function Feed() {
  const posts = useQuery(api.posts.listFeed);

  if (posts === undefined) {
    return (
      <div className="mt-8">
        <h2
          className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-3"
          style={{ fontFamily: "'Archivo Black', sans-serif" }}
        >
          <span className="bg-[#00E676] px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_#000] -rotate-1">
            FEED
          </span>
          <span className="animate-pulse">📺</span>
        </h2>

        {/* Loading Skeletons */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-4 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-300 border-3 border-black" />
                <div className="h-5 bg-gray-300 w-32" />
              </div>
              <div className="aspect-video bg-gray-200 border-4 border-black" />
              <div className="h-4 bg-gray-200 w-3/4 mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="mt-8">
        <h2
          className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-3"
          style={{ fontFamily: "'Archivo Black', sans-serif" }}
        >
          <span className="bg-[#00E676] px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_#000] -rotate-1">
            FEED
          </span>
          <span>📺</span>
        </h2>

        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#FFEA00] p-8 md:p-12 text-center">
          <div className="text-6xl md:text-8xl mb-4">🎬</div>
          <h3
            className="text-xl md:text-2xl font-black mb-2"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            NO VIDEOS YET!
          </h3>
          <p
            className="text-black/60 font-medium"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Be the first to create something amazing! ⬆️
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 pb-8">
      <h2
        className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-3"
        style={{ fontFamily: "'Archivo Black', sans-serif" }}
      >
        <span className="bg-[#00E676] px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_#000] -rotate-1">
          FEED
        </span>
        <span>📺</span>
        <span
          className="text-sm font-bold text-black/40 ml-auto"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          {posts.length} video{posts.length !== 1 ? "s" : ""}
        </span>
      </h2>

      <div className="space-y-6">
        {posts.map((post: Post, index: number) => (
          <VideoCard key={post._id} post={post} index={index} />
        ))}
      </div>
    </div>
  );
}
