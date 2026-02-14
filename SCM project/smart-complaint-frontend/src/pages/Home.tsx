// src/pages/Home.tsx
import React from "react";
import HomeNavbar from "../components/HomeNavbar";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import Stats from "../components/Stats";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navbar (fixed) */}
      <HomeNavbar />

      {/* Smooth fade/slide transition */}
      <PageTransition>
        {/* HERO */}
        <HeroSection />

        {/* FEATURES */}
        <Features />

        {/* STATS */}
        <Stats />

        {/* FOOTER */}
        <Footer />
      </PageTransition>
    </div>
  );
};

export default Home;
