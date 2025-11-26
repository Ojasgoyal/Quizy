import { useEffect, useState } from "react";

export default function InstallPage() {
  const [prompt, setPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = () => {
    if (prompt) prompt.prompt();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-around md:justify-center gap-10">

      {/* Text */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xs">
        <img
          src="Quizy.png"
          className="w-18 mb-4 rounded-full shadow-md"
          alt="Quizy"
        />

        <h1 className="text-3xl font-bold mb-2">
          Install Quizy
        </h1>

        <p className="opacity-70 mb-6">
          Play quizzes faster, smoother, and distraction-free!
        </p>

        <button
          onClick={install}
          disabled={!prompt}
          className={`btn btn-accent btn-lg w-full ${
            !prompt ? "btn-disabled" : ""
          }`}
        >
          Install App
        </button>
      </div>

      {/* Screenshot */}
      <div className="bg-base-200 rounded-3xl p-1 shadow-xl">
        <div className="w-64 overflow-hidden rounded-2xl">
          <img
            src="/screenshots/image.png"
            className="w-full h-full object-cover"
            alt="Quiz Preview"
          />
        </div>
      </div>
    </div>
  );
}
