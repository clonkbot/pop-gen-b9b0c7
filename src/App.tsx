import { useConvexAuth } from "convex/react";
import { AuthScreen } from "./components/AuthScreen";
import { Feed } from "./components/Feed";
import { Header } from "./components/Header";
import { CreatePost } from "./components/CreatePost";
import { Toaster } from "react-hot-toast";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDE7] flex items-center justify-center">
        <div className="animate-bounce">
          <div className="w-20 h-20 bg-[#FF1744] border-4 border-black shadow-[8px_8px_0px_0px_#000] flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDE7] relative overflow-x-hidden">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#000",
            color: "#fff",
            border: "4px solid #000",
            borderRadius: "0",
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: "14px",
            padding: "16px",
          },
          success: {
            style: {
              background: "#00E676",
              color: "#000",
            },
          },
          error: {
            style: {
              background: "#FF1744",
              color: "#fff",
            },
          },
        }}
      />

      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 40px,
              #000 40px,
              #000 41px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 40px,
              #000 40px,
              #000 41px
            )`,
          }}
        />
      </div>

      {!isAuthenticated ? (
        <AuthScreen />
      ) : (
        <div className="relative z-10">
          <Header />
          <main className="max-w-3xl mx-auto px-4 pb-24 md:px-8">
            <CreatePost />
            <Feed />
          </main>
        </div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-2 px-4 bg-[#FFFDE7]/90 backdrop-blur-sm border-t-2 border-black/10 z-50">
        <p className="text-center text-xs text-black/40 font-mono">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}
