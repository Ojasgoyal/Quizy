// ...existing code...
import React, { useEffect, useRef } from "react";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";

export default function CTASection() {
  const sectionRef = useRef(null);
  const elementsRef = useRef([]);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elementsRef.current.forEach((el) => {
        if (el) {
          el.classList.remove("opacity-0", "translate-y-6");
          el.classList.add("opacity-100", "translate-y-0");
        }
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          
          // Animate all elements at once
          elementsRef.current.forEach((el, i) => {
            if (el) {
              setTimeout(() => {
                el.classList.remove("opacity-0", "translate-y-6", "scale-95");
                el.classList.add("opacity-100", "translate-y-0", "scale-100");
              }, i * 100);
            }
          });
          
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      io.observe(sectionRef.current);
    }

    return () => io.disconnect();
  }, []);

  return (
    <section className="py-16 px-6" ref={sectionRef}>
      <div className="max-w-4xl mx-auto">
        <div
          ref={(el) => (elementsRef.current[0] = el)}
          className="opacity-0 translate-y-6 scale-95 transform transition-all duration-800 ease-out card bg-gradient-to-br from-base-100 to-accent/20 border border-base-300 shadow-xl rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          {/* Subtle background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-6 left-6">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="absolute bottom-6 right-6">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <div className="absolute top-1/3 right-1/4">
              <Sparkles className="w-3 h-3 text-secondary" />
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            {/* Badge */}
            <div
              ref={(el) => (elementsRef.current[1] = el)}
              className="opacity-0 translate-y-6 scale-95 transform transition-all duration-600 ease-out badge badge-secondary rounded-full badge-lg"
              style={{ transitionDelay: "200ms" }}
            >
              🚀 Ready to start?
            </div>
            
            {/* Main heading */}
            <h2
              ref={(el) => (elementsRef.current[2] = el)}
              className="opacity-0 translate-y-6 transform transition-all duration-600 ease-out text-3xl sm:text-4xl font-extrabold"
              style={{ transitionDelay: "300ms" }}
            >
              Create your first quiz in minutes
            </h2>
            
            {/* Description */}
            <p
              ref={(el) => (elementsRef.current[3] = el)}
              className="opacity-0 translate-y-6 transform transition-all duration-600 ease-out text-lg text-base-content/70 max-w-2xl mx-auto"
              style={{ transitionDelay: "400ms" }}
            >
              Join thousands of teachers and learners who are already using Quizy to build engaging learning experiences.
            </p>

            {/* Features list */}
            <div className="flex flex-col items-center space-y-3 my-8">
              {[
                "Free forever plan",
                "No credit card required", 
                "Setup in 2 minutes"
              ].map((feature, i) => (
                <div
                  key={feature}
                  ref={(el) => (elementsRef.current[4 + i] = el)}
                  className="opacity-0 translate-y-6 transform transition-all duration-500 ease-out flex items-center gap-3 text-base-content/80"
                  style={{ transitionDelay: `${500 + i * 100}ms` }}
                >
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div
              ref={(el) => (elementsRef.current[7] = el)}
              className="opacity-0 translate-y-6 transform transition-all duration-600 ease-out flex flex-col sm:flex-row items-center justify-center gap-4"
              style={{ transitionDelay: "800ms" }}
            >
              <a 
                href="/signup" 
                className="btn btn-primary btn-lg rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get started for free
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              
              <a 
                href="/play" 
                className="btn btn-outline btn-lg rounded-full px-8 hover:bg-base-200"
              >
                Play Demo Quiz
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// ...existing code...