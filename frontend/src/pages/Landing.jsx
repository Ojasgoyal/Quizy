import React from "react";
import Hero from "../components/Landing/Hero";
import CardSection from "../components/Landing/CardSection";
import Footer from "../components/Footer/Footer";
import HowItWorks from "../components/Landing/HowItWorks";
import CTASection from "../components/Landing/CTASection";

export default function Landing() {
  return (
    <>
      <div className="max-w-7xl mx-auto">
        <Hero />
        <CardSection />
        <HowItWorks />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
