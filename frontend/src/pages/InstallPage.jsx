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
    if (prompt) {
      prompt.prompt();
    }
  };

  return (
    <div className="flex flex-col items-center -mt-20 justify-center h-screen gap-4">
      <button
        className="px-4 py-2 btn btn-xl btn-accent text-white rounded"
        onClick={install}
      >
        Install Quizy App
      </button>
    </div>
  );
}
