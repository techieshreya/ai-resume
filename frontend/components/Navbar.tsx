"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Product", href: "/builder" },
    { label: "Templates", href: "/#features" },
    { label: "About Us", href: "/about" },
    { label: "Pricing", href: "/#pricing" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-[#E5E7EB] dark:border-[#374151]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="bg-[#6366F1] text-white p-1.5 rounded-lg mr-3 shadow-md">
              <span className="material-symbols-outlined text-xl">
                auto_awesome
              </span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">
              Resume.ai
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-500 hover:text-[#6366F1] dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              <span className="material-symbols-outlined text-xl">
                {theme === "dark" ? "light_mode" : "dark_mode"}
              </span>
            </button>

            <Link
              href="/login"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm font-medium transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-[#E5E7EB] dark:border-[#374151]">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#6366F1] dark:hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-3 border-t border-[#E5E7EB] dark:border-[#374151]">
              <button
                onClick={toggleTheme}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-[#E5E7EB] dark:border-[#374151] flex items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <span className="material-symbols-outlined text-lg">
                  {theme === "dark" ? "light_mode" : "dark_mode"}
                </span>
                {theme === "dark" ? "Light" : "Dark"} Mode
              </button>
              <Link
                href="/login"
                className="flex-1 px-4 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-[#374151] text-sm font-medium text-center text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
            </div>
            <Link
              href="/signup"
              className="block w-full px-4 py-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
