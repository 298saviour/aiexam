'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const benefits = [
  'Precision AI grading with GPT-4o-mini',
  'Real-time performance analytics',
  'Automated exam management',
  'Secure and scalable infrastructure',
  'Comprehensive audit logging',
  'Mobile-responsive design',
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Built for Modern Learning
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Designed by educators and engineers, this platform blends precision, 
              automation, and simplicity to transform assessments and academic management.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold group"
            >
              Meet Our Vision
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right: Visual with Real Images */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Main Image */}
              <div className="relative h-96">
                <img
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop&q=80"
                  alt="Students collaborating on exam"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent"></div>
                
                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                        AI
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">Intelligent Grading</div>
                        <div className="text-sm text-gray-600">Powered by GPT-4o-mini</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">99%</div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">80%</div>
                        <div className="text-xs text-gray-600">Time Saved</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">24/7</div>
                        <div className="text-xs text-gray-600">Available</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-xl font-bold z-10">
                AI-Powered
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-cyan-200 rounded-full opacity-50 blur-2xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
