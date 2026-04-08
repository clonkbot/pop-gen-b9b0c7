import { useAuthActions } from "@convex-dev/auth/react";

export function Header() {
  const { signOut } = useAuthActions();

  return (
    <header className="sticky top-0 z-50 bg-[#FFFDE7]/95 backdrop-blur-sm border-b-4 border-black">
      <div className="max-w-3xl mx-auto px-4 py-4 md:px-8 flex items-center justify-between">
        <h1
          className="text-2xl md:text-4xl font-black text-black tracking-tighter flex items-center gap-2"
          style={{ fontFamily: "'Archivo Black', sans-serif" }}
        >
          <span className="hidden sm:inline">🎬</span>
          POP
          <span className="inline-block bg-[#FF1744] text-white px-2 py-0.5 border-3 border-black shadow-[3px_3px_0px_0px_#000] -rotate-1 text-xl md:text-3xl">
            GEN
          </span>
        </h1>

        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-black text-white text-sm md:text-base font-bold border-3 border-black shadow-[4px_4px_0px_0px_#00E676] hover:shadow-[2px_2px_0px_0px_#00E676] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          LOG OUT
        </button>
      </div>
    </header>
  );
}
