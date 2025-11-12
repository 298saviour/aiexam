'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Users, Zap, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0f0529' }}>
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=1080&fit=crop&q=90"
          alt="Education Background"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/95 via-purple-900/90 to-primary-950/95"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-semibold text-white mb-6"
            >
              About AI Exam Platform
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-purple-100 max-w-3xl mx-auto font-normal"
            >
              Revolutionizing education in Nigeria with AI-powered examination management
            </motion.p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <Target className="w-12 h-12 text-cyan-400 mb-4" />
                  <h2 className="text-3xl font-semibold text-white mb-4">Our Mission</h2>
                  <p className="text-purple-100 leading-relaxed font-normal">
                    To empower Nigerian educational institutions with cutting-edge AI technology that makes 
                    examination management faster, fairer, and more accurate. We believe every student deserves 
                    unbiased grading and every teacher deserves tools that save time.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <Zap className="w-12 h-12 text-yellow-400 mb-4" />
                  <h2 className="text-3xl font-semibold text-white mb-4">Our Vision</h2>
                  <p className="text-purple-100 leading-relaxed font-normal">
                    To become Africa's leading AI-powered education platform, transforming how millions of 
                    students learn and how thousands of educators teach. We envision a future where technology 
                    eliminates educational barriers and creates equal opportunities for all.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Why We Built This */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl p-12 border border-white/20"
            >
              <Heart className="w-12 h-12 text-pink-400 mb-6 mx-auto" />
              <h2 className="text-3xl font-semibold text-white mb-6 text-center">Why We Built This</h2>
              <div className="space-y-4 text-purple-100 font-normal">
                <p className="leading-relaxed">
                  <strong className="text-white">The Problem:</strong> Nigerian teachers spend countless hours manually grading exams, 
                  leading to burnout and delayed results. Students wait weeks for feedback, and human bias can 
                  sometimes affect grading fairness.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">Our Solution:</strong> AI Exam Platform uses GPT-4o-mini to automatically grade written 
                  answers with 95%+ accuracy, reducing grading time by 80%. Teachers get their time back, students 
                  get instant feedback, and everyone benefits from unbiased, consistent grading.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">The Impact:</strong> We're not just building software – we're transforming education. 
                  Every exam graded by our AI means more time for teachers to focus on teaching, and faster learning 
                  for students who get immediate insights into their performance.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Core Values */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-semibold text-white text-center mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Fairness',
                  description: 'AI ensures every student is graded objectively, without human bias or favoritism.',
                  icon: '⚖️',
                },
                {
                  title: 'Speed',
                  description: 'Instant grading means students get feedback immediately, accelerating their learning.',
                  icon: '⚡',
                },
                {
                  title: 'Accuracy',
                  description: 'GPT-4o-mini delivers 95%+ accuracy, matching or exceeding human grading quality.',
                  icon: '🎯',
                },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center"
                >
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-2xl font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-purple-100 font-normal">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '10,000+', label: 'Students' },
                { number: '500+', label: 'Teachers' },
                { number: '50+', label: 'Schools' },
                { number: '95%', label: 'Accuracy' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-semibold text-cyan-400 mb-2">{stat.number}</div>
                  <div className="text-purple-100 font-normal">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl p-12"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
                Ready to Transform Your Institution?
              </h2>
              <p className="text-xl text-white/90 mb-8 font-normal">
                Join thousands of educators already using AI Exam Platform
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-950 rounded-lg hover:bg-purple-50 transition-all duration-300 font-medium text-lg shadow-xl"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
