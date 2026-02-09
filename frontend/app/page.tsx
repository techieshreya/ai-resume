"use client";
import React from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Stats from '@/components/landing/Stats';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    // Wrap everything in ThemeProvider
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        <main>
            <Hero />
            <Features />
            <HowItWorks />
            <Stats />
            <Testimonials />
            <Pricing />
            <FAQ />
            <FinalCTA />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
