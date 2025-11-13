import React from "react";
import Hero from "../components/landing/Hero";
import CardSection from "../components/landing/CardSection";
import Footer from "../components/Footer/Footer";
import HowItWorks from "../components/landing/HowItWorks";
import CTASection from "../components/landing/CTASection";

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
