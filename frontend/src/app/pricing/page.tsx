'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '₦0',
    period: 'forever',
    description: 'Perfect for trying out the platform',
    features: [
      'Up to 50 students',
      '5 exams per month',
      'Basic AI grading',
      'Email support',
      'Standard analytics',
      '1 teacher account',
    ],
    cta: 'Start Free',
    popular: false,
    color: 'from-gray-500 to-gray-600',
  },
  {
    name: 'School',
    price: '₦25,000',
    period: 'per month',
    description: 'Ideal for small to medium schools',
    features: [
      'Up to 500 students',
      'Unlimited exams',
      'Advanced AI grading',
      'Priority support',
      'Advanced analytics',
      'Up to 20 teachers',
      'Custom branding',
      'Bulk operations',
    ],
    cta: 'Start Free Trial',
    popular: true,
    color: 'from-purple-500 to-cyan-500',
  },
  {
    name: 'Institution',
    price: '₦75,000',
    period: 'per month',
    description: 'For large institutions and universities',
    features: [
      'Unlimited students',
      'Unlimited exams',
      'Premium AI grading',
      '24/7 dedicated support',
      'Enterprise analytics',
      'Unlimited teachers',
      'White-label solution',
      'API access',
      'Custom integrations',
      'On-premise deployment',
    ],
    cta: 'Contact Sales',
    popular: false,
    color: 'from-orange-500 to-red-500',
  },
];

export default function PricingPage() {
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
              Simple, Transparent Pricing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-purple-100 max-w-3xl mx-auto font-normal"
            >
              Choose the perfect plan for your institution. All plans include a 14-day free trial.
            </motion.p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={`relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border ${
                    plan.popular ? 'border-cyan-400 shadow-2xl shadow-cyan-500/20' : 'border-white/20'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-semibold text-white mb-2">{plan.name}</h3>
                    <p className="text-purple-200 text-sm font-normal mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-semibold text-white">{plan.price}</span>
                      <span className="text-purple-200 font-normal">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-purple-100 font-normal">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/auth/register"
                    className={`block w-full py-4 rounded-lg text-center font-medium transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/50'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-semibold text-white text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Can I switch plans later?',
                  a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
                },
                {
                  q: 'Is there a free trial?',
                  a: 'All paid plans come with a 14-day free trial. No credit card required to start.',
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept bank transfers, card payments (Visa, Mastercard), and mobile money (MTN, Airtel).',
                },
                {
                  q: 'Can I cancel anytime?',
                  a: 'Yes, you can cancel your subscription at any time. No questions asked, no cancellation fees.',
                },
                {
                  q: 'Do you offer discounts for annual payments?',
                  a: 'Yes! Pay annually and get 2 months free (equivalent to 16% discount).',
                },
              ].map((faq, index) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-purple-100 font-normal">{faq.a}</p>
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
                Still Have Questions?
              </h2>
              <p className="text-xl text-white/90 mb-8 font-normal">
                Our team is here to help you choose the right plan
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-950 rounded-lg hover:bg-purple-50 transition-all duration-300 font-medium text-lg shadow-xl"
              >
                Contact Sales
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
