import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import toast from "react-hot-toast";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signUp");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch {
      toast.error(flow === "signIn" ? "Sign in failed!" : "Sign up failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    try {
      await signIn("anonymous");
    } catch {
      toast.error("Could not continue as guest");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Decorative Elements */}
      <div className="absolute top-8 left-8 w-16 h-16 md:w-24 md:h-24 bg-[#00E676] border-4 border-black shadow-[6px_6px_0px_0px_#000] rotate-12 animate-pulse" />
      <div className="absolute top-20 right-12 w-12 h-12 md:w-20 md:h-20 bg-[#FF1744] border-4 border-black shadow-[6px_6px_0px_0px_#000] -rotate-6" />
      <div className="absolute bottom-32 left-16 w-14 h-14 md:w-16 md:h-16 bg-[#FFEA00] border-4 border-black shadow-[6px_6px_0px_0px_#000] rotate-45" />
      <div className="absolute bottom-24 right-8 w-20 h-20 md:w-28 md:h-28 bg-[#00B0FF] border-4 border-black shadow-[6px_6px_0px_0px_#000] -rotate-12" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="text-5xl md:text-7xl font-black text-black tracking-tighter"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            POP
            <span className="inline-block bg-[#FF1744] text-white px-2 border-4 border-black shadow-[4px_4px_0px_0px_#000] ml-2 -rotate-2">
              GEN
            </span>
          </h1>
          <p
            className="mt-4 text-lg md:text-xl font-bold text-black/70"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            AI VIDEO MAGIC FOR KIDS! 🎬✨
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-6 md:p-8">
          <h2
            className="text-2xl font-black mb-6 text-center"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            {flow === "signIn" ? "WELCOME BACK!" : "JOIN THE FUN!"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-bold mb-2 uppercase tracking-wider"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border-4 border-black text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-shadow"
                style={{ fontFamily: "'Space Mono', monospace" }}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                className="block text-sm font-bold mb-2 uppercase tracking-wider"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border-4 border-black text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-shadow"
                style={{ fontFamily: "'Space Mono', monospace" }}
                placeholder="••••••••"
              />
            </div>

            <input name="flow" type="hidden" value={flow} />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#FF1744] text-white text-xl font-black border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Archivo Black', sans-serif" }}
            >
              {isLoading
                ? "LOADING..."
                : flow === "signIn"
                  ? "LET'S GO! →"
                  : "CREATE ACCOUNT →"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="text-sm font-bold underline decoration-4 decoration-[#00E676] hover:decoration-[#FF1744] transition-colors"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {flow === "signIn"
                ? "New here? Sign up instead!"
                : "Already have an account? Sign in!"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t-4 border-black/10">
            <button
              onClick={handleAnonymous}
              disabled={isLoading}
              className="w-full py-3 bg-[#FFEA00] text-black text-lg font-black border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
              style={{ fontFamily: "'Archivo Black', sans-serif" }}
            >
              👻 CONTINUE AS GUEST
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
