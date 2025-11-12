'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain,
  Zap,
  Shield,
  TrendingUp,
  FileText,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  Lock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Grading',
    description: 'GPT-4o-mini automatically grades written answers with 95%+ accuracy, saving teachers 80% of grading time.',
    benefits: ['Instant results', 'Unbiased grading', 'Consistent scoring', 'Detailed feedback'],
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Grade hundreds of exams in seconds. What used to take days now takes minutes.',
    benefits: ['Real-time processing', 'Bulk grading', 'Instant feedback', 'No delays'],
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with role-based access control and encrypted data storage.',
    benefits: ['Data encryption', 'Role-based access', 'Audit logs', 'GDPR compliant'],
    color: 'from-green-500 to-teal-500',
  },
  {
    icon: TrendingUp,
    title: 'Performance Analytics',
    description: 'Track student progress with detailed analytics, charts, and personalized insights.',
    benefits: ['Visual dashboards', 'Trend analysis', 'Performance reports', 'Predictive insights'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FileText,
    title: 'Smart Exam Builder',
    description: 'Create exams with multiple question types: MCQ, True/False, Short Answer, and Essay.',
    benefits: ['Question bank', 'Auto-generation', 'Templates', 'Easy editing'],
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Users,
    title: 'Multi-Role Support',
    description: 'Separate dashboards for admins, teachers, and students with tailored features for each role.',
    benefits: ['Admin control', 'Teacher tools', 'Student portal', 'Parent access'],
    color: 'from-pink-500 to-rose-500',
  },
];

const additionalFeatures = [
  { icon: BarChart3, text: 'Real-time progress tracking' },
  { icon: Clock, text: 'Automated scheduling' },
  { icon: CheckCircle, text: 'Plagiarism detection' },
  { icon: Lock, text: 'Secure exam delivery' },
  { icon: Sparkles, text: 'AI-generated questions' },
  { icon: FileText, text: 'PDF report generation' },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0f0529' }}>
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1920&h=1080&fit=crop&q=90"
          alt="Background"
          className="w-full h-full object-cover opacity-10"
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
              Powerful Features
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-purple-100 max-w-3xl mx-auto font-normal"
            >
              Everything you need to transform examination management with AI
            </motion.p>
          </div>
        </div>

        {/* Main Features */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-4 mb-6`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-purple-100 mb-6 font-normal">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-purple-200 font-normal">
                        <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-semibold text-white text-center mb-12">And Much More...</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {additionalFeatures.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center hover:bg-white/20 transition-all"
                >
                  <feature.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <p className="text-sm text-purple-100 font-normal">{feature.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-semibold text-white text-center mb-12">How It Works</h2>
            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Create Your Exam',
                  description: 'Use our intuitive exam builder to create questions. Choose from MCQ, True/False, Short Answer, or Essay types.',
                },
                {
                  step: '2',
                  title: 'Students Take the Exam',
                  description: 'Students log in and take the exam on their computers. All answers are automatically saved and timestamped.',
                },
                {
                  step: '3',
                  title: 'AI Grades Instantly',
                  description: 'Our GPT-4o-mini AI engine grades all answers in seconds, providing detailed feedback and scores.',
                },
                {
                  step: '4',
                  title: 'Review & Publish',
                  description: 'Teachers review AI grades, make adjustments if needed, and publish results to students instantly.',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 items-start bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-xl flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-purple-100 font-normal">{item.description}</p>
                  </div>
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
                Ready to Experience These Features?
              </h2>
              <p className="text-xl text-white/90 mb-8 font-normal">
                Start your free trial today and see the difference AI can make
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
