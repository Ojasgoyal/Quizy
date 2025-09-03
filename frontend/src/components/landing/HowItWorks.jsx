import React from "react";
import { Plus, Share, Play, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Create Quiz",
    desc: "Use our intuitive builder to create quizzes with multiple choice, true/false, and more question types.",
    icon: <Plus className="w-6 h-6" />,
  },
  {
    step: "02", 
    title: "Share Link",
    desc: "Get a shareable link or quiz code that you can send to anyone - no account required to play.",
    icon: <Share className="w-6 h-6" />,
  },
  {
    step: "03",
    title: "Players Join",
    desc: "Participants join using the link or code, enter their name, and start answering questions.",
    icon: <Play className="w-6 h-6" />,
  },
  {
    step: "04",
    title: "View Results",
    desc: "Get instant results with detailed analytics, leaderboards, and insights on performance.",
    icon: <BarChart3 className="w-6 h-6" />,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            How Quizy works
          </h2>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            Create engaging quizzes in minutes and share them with the world. 
            It's simple, fast, and designed for everyone.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-accent to-secondary opacity-30 hidden md:block"></div>

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
                className="relative flex items-start gap-6"
              >
                {/* Step circle with icon */}
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-info to-accent text-white flex items-center justify-center shadow-lg border-4 border-base-100">
                    {step.icon}
                  </div>
                </div>

                {/* Content card */}
                <div className="flex-1">
                  <div className="card bg-gradient-to-br from-base-100 to-info/20 border border-base-300 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="badge badge-accent text-xs font-medium">
                        Step {step.step}
                      </span>
                      <h3 className="text-xl font-semibold">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-base-content/70 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}