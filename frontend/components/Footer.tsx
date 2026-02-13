"use client";
import React from "react";
import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Templates", href: "#" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Enterprise", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

const socialIcons = [
  { icon: "public", href: "https://github.com", label: "Website" },
  { icon: "alternate_email", href: "mailto:hello@resume.ai", label: "Email" },
  { icon: "rss_feed", href: "#", label: "RSS" },
];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-[#6366F1] text-white p-1 rounded-md mr-2">
                <span className="material-symbols-outlined text-lg">
                  auto_awesome
                </span>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                Resume.ai
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Building the future of career storytelling. We help you land your
              dream job with AI-powered resume optimization.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialIcons.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#6366F1] transition-colors"
                  aria-label={social.label}
                >
                  <span className="material-symbols-outlined">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section, i) => (
            <div key={i}>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={link.href}
                      className="hover:text-[#6366F1] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} Resume.ai Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-xs text-gray-500">Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
