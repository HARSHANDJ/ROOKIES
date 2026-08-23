import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Hero } from '../components/landing/Hero';
import { TrustConcept } from '../components/landing/TrustConcept';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FeatureCards } from '../components/landing/FeatureCards';
import { ExploreDemo } from '../components/landing/ExploreDemo';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500/30 selection:text-brand-300">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustConcept />
        <HowItWorks />
        <FeatureCards />
        <ExploreDemo />
      </main>
      <Footer />
    </div>
  );
};
