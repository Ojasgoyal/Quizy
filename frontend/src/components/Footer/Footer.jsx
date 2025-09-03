import React, { useState } from "react";
import { Twitter, Github, Mail, Linkedin } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 3500);
  };

  return (
    <footer className="border-t border-base-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">Quizy</span>
              <span className="badge badge-primary badge-outline">v1</span>
            </div>
            <p className="text-sm text-base-content/70 max-w-xs">
              Build and share interactive quizzes — lightweight, fast, and designed for learning.
            </p>
            <div className="flex items-center gap-2">
              <a aria-label="Twitter" href="#" className="btn btn-sm btn-circle btn-ghost">
                <Twitter className="w-4 h-4" />
              </a>
              <a aria-label="Github" href="#" className="btn btn-sm btn-circle btn-ghost">
                <Github className="w-4 h-4" />
              </a>
              <a aria-label="LinkedIn" href="#" className="btn btn-sm btn-circle btn-ghost">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-base-content/70">
              <li><a href="/play" className="link link-hover">Play Quiz</a></li>
              <li><a href="/signup" className="link link-hover">Sign up</a></li>
              <li><a href="/docs" className="link link-hover">Documentation</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-base-content/70">
              <li><a href="/about" className="link link-hover">About</a></li>
              <li><a href="/contact" className="link link-hover">Contact</a></li>
              <li><a href="/careers" className="link link-hover">Careers</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Stay updated</h4>
            <p className="text-sm text-base-content/70 mb-4">Get notified about new features and updates.</p>
            <form onSubmit={onSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="input border focus:border-0 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary w-full">
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </button>
              {sent && (
                <div className="text-sm text-success">
                  Thanks! Check your inbox soon.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="divider mt-6"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-base-content/60">
          <div>© {new Date().getFullYear()} Quizy. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="link link-hover">Privacy Policy</a>
            <a href="/terms" className="link link-hover">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}