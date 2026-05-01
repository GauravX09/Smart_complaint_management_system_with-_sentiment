import React from "react";
import HomeNavbar from "../components/HomeNavbar";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      <HomeNavbar />

      <PageTransition>
        <HeroSection />
        <HowItWorks />
        <Features />
        <Testimonials />
        <CTASection />
        <Footer />
      </PageTransition>

    </div>
  );
};

export default Home;