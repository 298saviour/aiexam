'use client';

import { useState } from 'react';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { Menu, X } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030303]/80 backdrop-blur-lg border-b border-white/[0.08]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-rose-300">
            AI Examiner
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-white/60 hover:text-white transition-colors">
              About
            </a>
            <a href="#contact" className="text-white/60 hover:text-white transition-colors">
              Contact
            </a>
            <a href="#privacy" className="text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a
              href="/dev-login"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300"
            >
              Login
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a
              href="#about"
              className="block text-white/60 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
            <a
              href="#contact"
              className="block text-white/60 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
            <a
              href="#privacy"
              className="block text-white/60 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Privacy Policy
            </a>
            <a
              href="/dev-login"
              className="block px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium text-center"
              onClick={() => setIsOpen(false)}
            >
              Login
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-20 bg-[#030303]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-rose-300">
            About AI Examiner
          </h2>
          <p className="text-lg text-white/60 mb-8 leading-relaxed">
            AI Examiner is a cutting-edge examination platform designed for Nigerian schools.
            We leverage artificial intelligence to provide instant, accurate grading for multiple
            question types including MCQs, essays, and short answers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-lg">
              <h3 className="text-2xl font-bold text-white mb-3">AI-Powered</h3>
              <p className="text-white/60">
                Advanced AI grading with leniency for essay questions
              </p>
            </div>
            <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-lg">
              <h3 className="text-2xl font-bold text-white mb-3">Instant Results</h3>
              <p className="text-white/60">
                Get exam results immediately after submission
              </p>
            </div>
            <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-lg">
              <h3 className="text-2xl font-bold text-white mb-3">Grade Queries</h3>
              <p className="text-white/60">
                Students can query grades and teachers can review
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-[#030303] border-t border-white/[0.08]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-rose-300">
            Get in Touch
          </h2>
          <p className="text-lg text-white/60 mb-8">
            Have questions? We'd love to hear from you.
          </p>
          <div className="space-y-4">
            <p className="text-white/60">
              <strong className="text-white">Email:</strong> support@aiexaminer.ng
            </p>
            <p className="text-white/60">
              <strong className="text-white">Phone:</strong> +234 800 000 0000
            </p>
            <p className="text-white/60">
              <strong className="text-white">Address:</strong> Lagos, Nigeria
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PrivacySection() {
  return (
    <section id="privacy" className="py-20 bg-[#030303] border-t border-white/[0.08]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-rose-300">
            Privacy Policy
          </h2>
          <div className="space-y-6 text-white/60">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Data Collection</h3>
              <p>
                We collect only necessary information to provide our services, including student
                names, exam responses, and performance data.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Data Security</h3>
              <p>
                All data is encrypted and stored securely. We use industry-standard security
                measures to protect your information.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Data Usage</h3>
              <p>
                Your data is used solely for educational purposes and improving our AI grading
                system. We never sell or share your data with third parties.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Your Rights</h3>
              <p>
                You have the right to access, modify, or delete your data at any time. Contact
                us for any data-related requests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 bg-[#030303] border-t border-white/[0.08]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-white/40 text-sm">
            © 2025 AI Examiner. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#about" className="text-white/40 hover:text-white text-sm transition-colors">
              About
            </a>
            <a href="#contact" className="text-white/40 hover:text-white text-sm transition-colors">
              Contact
            </a>
            <a href="#privacy" className="text-white/40 hover:text-white text-sm transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030303]">
      <Navbar />
      <HeroGeometric
        badge="AI-Powered Exam Platform"
        title1="Welcome to"
        title2="AI Examiner"
        subtitle="Creating Digital Learning Experience for Students with AI-Powered Grading"
      />
      <AboutSection />
      <ContactSection />
      <PrivacySection />
      <Footer />
    </main>
  );
}
