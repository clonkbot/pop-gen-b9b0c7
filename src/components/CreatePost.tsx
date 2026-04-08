import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import toast from "react-hot-toast";

const PROMPT_SUGGESTIONS = [
  "A friendly robot learning to dance 🤖",
  "A rainbow unicorn flying through cotton candy clouds 🦄",
  "A baby dinosaur playing in a puddle 🦕",
  "A magical treehouse with fairy lights ✨",
  "A space cat exploring a colorful planet 🐱🚀",
  "A penguin sliding down a rainbow 🐧🌈",
];

export function CreatePost() {
  const [prompt, setPrompt] = useState("");
  const [username, setUsername] = useState(() => {
    const saved = localStorage.getItem("popgen_username");
    return saved || `Creator${Math.floor(Math.random() * 1000)}`;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUsernameEdit, setShowUsernameEdit] = useState(false);

  const createPost = useMutation(api.posts.create);
  const generateVideo = useAction(api.posts.generateVideoForPost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    localStorage.setItem("popgen_username", username);

    try {
      const postId = await createPost({ prompt: prompt.trim(), username });
      toast.success("Video is cooking! This takes about 1-2 minutes... 🎬");
      setPrompt("");

      // Start video generation (this runs in the background)
      generateVideo({ postId, prompt: prompt.trim() }).catch(() => {
        toast.error("Video generation failed 😢");
      });
    } catch {
      toast.error("Failed to create post");
    } finally {
      setIsGenerating(false);
    }
  };

  const useSuggestion = (suggestion: string) => {
    setPrompt(suggestion.replace(/\s*[🤖🦄🦕✨🐱🚀🐧🌈]/g, "").trim());
  };

  return (
    <div className="my-8">
      {/* Username Section */}
      <div className="mb-4 flex items-center gap-3">
        <span
          className="text-sm font-bold text-black/60"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          POSTING AS:
        </span>
        {showUsernameEdit ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.slice(0, 20))}
              className="px-3 py-1 border-3 border-black text-sm font-bold focus:outline-none"
              style={{ fontFamily: "'Space Mono', monospace" }}
              autoFocus
            />
            <button
              onClick={() => {
                setShowUsernameEdit(false);
                localStorage.setItem("popgen_username", username);
              }}
              className="px-3 py-1 bg-[#00E676] border-3 border-black text-sm font-bold"
            >
              ✓
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowUsernameEdit(true)}
            className="px-3 py-1 bg-[#FFEA00] border-3 border-black text-sm font-bold hover:rotate-1 transition-transform"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            @{username}
          </button>
        )}
      </div>

      {/* Create Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#00B0FF] p-4 md:p-6">
          <label
            className="block text-lg font-black mb-3 uppercase"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            🎬 WHAT VIDEO DO YOU WANT TO CREATE?
          </label>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your Pixar-style video idea..."
            rows={3}
            maxLength={200}
            className="w-full px-4 py-3 border-4 border-black text-lg font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_#FF1744] transition-shadow resize-none"
            style={{ fontFamily: "'Space Mono', monospace" }}
            disabled={isGenerating}
          />

          <div className="flex justify-between items-center mt-2 text-sm text-black/50">
            <span style={{ fontFamily: "'Space Mono', monospace" }}>
              {prompt.length}/200
            </span>
          </div>

          {/* Suggestions */}
          <div className="mt-4">
            <p
              className="text-xs font-bold text-black/50 mb-2 uppercase"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Need ideas? Try these:
            </p>
            <div className="flex flex-wrap gap-2">
              {PROMPT_SUGGESTIONS.map((suggestion, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => useSuggestion(suggestion)}
                  className="px-3 py-1.5 bg-[#FFFDE7] border-2 border-black text-xs font-bold hover:bg-[#FFEA00] hover:-translate-y-0.5 transition-all"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="mt-6 w-full py-5 bg-[#FF1744] text-white text-xl md:text-2xl font-black border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[8px_8px_0px_0px_#000]"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-3">
                <span className="animate-spin">🎬</span>
                STARTING...
              </span>
            ) : (
              <>🚀 GENERATE VIDEO!</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
