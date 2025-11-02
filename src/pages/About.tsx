"use client";

import React from "react";
import AboutHero from "../components/about-page/AboutHero.tsx";
import AboutStats from "../components/about-page/AboutStats.tsx";
import AboutStory from "../components/about-page/AboutStory.tsx";
import AboutTeam from "../components/about-page/AboutTeam.tsx";
import AboutValues from "../components/about-page/AboutValues.tsx";

const About = () => {
  return (
    <div className="min-h-screen w-full">
      <AboutHero />
      <AboutStats />
      <AboutStory />
      <AboutTeam />
      <AboutValues />
    </div>
  );
};

export default About;