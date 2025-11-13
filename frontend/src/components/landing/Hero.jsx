import React, { useEffect, useRef } from "react";

export default function Hero() {
  const elementsRef = useRef([]);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      elementsRef.current.forEach((el) => {
        if (el) {
          el.classList.remove("opacity-0", "translate-y-6", "translate-x-8");
          el.classList.add("opacity-100", "translate-y-0", "translate-x-0");
        }
      });
      return;
    }

    // Animate on page load
    setTimeout(() => {
      elementsRef.current.forEach((el, i) => {
        if (el) {
          setTimeout(() => {
            el.classList.remove(
              "opacity-0",
              "translate-y-6",
              "translate-x-8",
              "scale-95"
            );
            el.classList.add(
              "opacity-100",
              "translate-y-0",
              "translate-x-0",
              "scale-100"
            );
          }, i * 150);
        }
      });
    }, 100);
  }, []);

  return (
    <>
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 flex items-end justify-center -z-10"
          aria-hidden="true"
        >
          <div
            className="w-[1100px] h-[700px] rounded-t-full blur-2xl opacity-80 
            bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.6),rgba(96,165,250,0.4)_40%,transparent_75%)]"
          />
        </div>

        {/* Text Section */}
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 items-center">
            <div className="space-y-4">
              <div
                ref={(el) => (elementsRef.current[0] = el)}
                className="opacity-0 translate-y-6 scale-95 transform transition-all duration-600 ease-out inline-flex items-center gap-2 bg-gradient-to-r from-accent to-info rounded-full px-3 py-1 text-sm shadow-lg font-medium"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-200">
                  Launching v1 Soon
                </span>
              </div>

              <h1
                ref={(el) => (elementsRef.current[1] = el)}
                className="opacity-0 translate-y-6 transform transition-all duration-800 ease-out text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
                style={{ transitionDelay: "150ms" }}
              >
                Build Engaging Quizzes in minutes
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  Create, Share and Play
                </span>
              </h1>

              <p
                ref={(el) => (elementsRef.current[2] = el)}
                className="opacity-0 translate-y-6 transform transition-all duration-600 ease-out text-lg max-w-xl"
                style={{ transitionDelay: "300ms" }}
              >
                Quizy helps teachers and creators craft beautiful, interactive
                quizzes with instant results, social sharing, and analytics.
              </p>

              <div
                ref={(el) => (elementsRef.current[3] = el)}
                className="opacity-0 translate-y-6 transform transition-all duration-600 ease-out flex flex-col sm:flex-row items-start sm:items-center gap-3"
                style={{ transitionDelay: "450ms" }}
              >
                <a
                  href="/login"
                  className="btn btn-primary rounded-full shadow-lg px-6 hover:scale-105 transition-transform duration-200"
                >
                  Get started
                </a>
                <a
                  href="/dashboard"
                  className="btn btn-ghost rounded-full px-6 hover:scale-105 transition-transform duration-200"
                >
                  Try demo
                </a>
              </div>
            </div>

            {/* Image Section */}
            <div
              ref={(el) => (elementsRef.current[4] = el)}
              className="opacity-0 translate-x-8 scale-95 transform transition-all duration-800 ease-out relative flex justify-center md:justify-center"
              style={{ transitionDelay: "400ms" }}
            >
              <img
                src="/hero.png"
                alt="Quizy Illustration"
                className="max-w-sm md:w-full drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
