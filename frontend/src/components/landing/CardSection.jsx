// CardSection.jsx
import React from "react";
import { ThumbsUp, BarChart2, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Easy Quiz Builder",
    desc: "Intuitive editor with templates to create quizzes in minutes.",
    icon: <ThumbsUp className="w-6 h-6" />,
  },
  {
    title: "Quick Detailed Results",
    desc: "Instant scoring, analytics and leaderboards to engage learners.",
    icon: <BarChart2 className="w-6 h-6" />,
  },
  {
    title: "Share with Anyone",
    desc: "Publish quizzes, share links for anyone to play",
    icon: <Share2 className="w-6 h-6" />,
  },
];

export default function CardSection() {
  return (
    <section className="py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            What you can do
          </h2>
          <p className="text-base-content/70 mt-3 max-w-2xl mx-auto">
            Powerful but simple tools to create interactive quizzes, play and
            learn .
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              viewport={{ once: true, amount: 0.15 }}
              className="rounded-xl"
            >
              <div className="card h-full bg-gradient-to-b from-base-100 to-primary/20 border border-base-200 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-transform duration-300 rounded-xl p-6 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-primary/30">
                <div className="flex items-start gap-4">
                  <div className="flex-none w-14 h-14 rounded-lg bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center shadow-md">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{f.title}</h3>
                    <p className="text-sm text-base-content/70 mt-1">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
