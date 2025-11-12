'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server, Key, AlertTriangle, CheckCircle, FileCheck } from 'lucide-react';

const securityFeatures = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'All data transmitted between your device and our servers is encrypted using industry-standard TLS 1.3 protocol.',
  },
  {
    icon: Shield,
    title: 'Secure Data Storage',
    description: 'Your data is stored in encrypted databases with regular backups and disaster recovery procedures.',
  },
  {
    icon: Key,
    title: 'Role-Based Access Control',
    description: 'Granular permissions ensure users only access data relevant to their role (admin, teacher, student).',
  },
  {
    icon: Eye,
    title: 'Activity Monitoring',
    description: 'Comprehensive audit logs track all system activities for security analysis and compliance.',
  },
  {
    icon: Server,
    title: 'Infrastructure Security',
    description: 'Hosted on enterprise-grade cloud infrastructure (AWS/Google Cloud) with 24/7 monitoring.',
  },
  {
    icon: AlertTriangle,
    title: 'Threat Detection',
    description: 'Real-time monitoring and automated alerts for suspicious activities or security threats.',
  },
];

export default function SecurityPage() {
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-teal-500 mb-6"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-semibold text-white mb-6"
            >
              Security & Compliance
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-purple-100 max-w-3xl mx-auto font-normal"
            >
              Your data security is our top priority. We implement enterprise-grade security measures to protect your institution's information.
            </motion.p>
          </div>
        </div>

        {/* Security Features */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-400/50 transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 p-3 mb-6">
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-purple-100 font-normal">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-semibold text-white text-center mb-12">Compliance & Certifications</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
              >
                <FileCheck className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-4">GDPR Compliant</h3>
                <p className="text-purple-100 font-normal mb-4">
                  We comply with the General Data Protection Regulation (GDPR) and Nigerian Data Protection Regulation (NDPR).
                </p>
                <ul className="space-y-2 text-purple-100 font-normal">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Right to access your data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Right to data portability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Right to be forgotten</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
              >
                <Shield className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-4">SOC 2 Type II</h3>
                <p className="text-purple-100 font-normal mb-4">
                  Our infrastructure and processes are audited annually for security, availability, and confidentiality.
                </p>
                <ul className="space-y-2 text-purple-100 font-normal">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Independent security audits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Continuous monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Regular penetration testing</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Security Practices */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-semibold text-white text-center mb-12">Our Security Practices</h2>
            <div className="space-y-6">
              {[
                {
                  title: 'Regular Security Audits',
                  description: 'Third-party security experts conduct quarterly audits of our systems and code.',
                },
                {
                  title: 'Employee Training',
                  description: 'All team members undergo security awareness training and follow strict access protocols.',
                },
                {
                  title: 'Incident Response Plan',
                  description: 'We have a comprehensive incident response plan with 24/7 monitoring and rapid response team.',
                },
                {
                  title: 'Data Backup & Recovery',
                  description: 'Automated daily backups with point-in-time recovery and 99.99% durability guarantee.',
                },
                {
                  title: 'Vulnerability Management',
                  description: 'Continuous vulnerability scanning and patching with automated security updates.',
                },
              ].map((practice, index) => (
                <motion.div
                  key={practice.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">{practice.title}</h3>
                  <p className="text-purple-100 font-normal">{practice.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Report Security Issue */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-12 border border-red-400/30 text-center"
            >
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-6" />
              <h2 className="text-3xl font-semibold text-white mb-4">Report a Security Issue</h2>
              <p className="text-purple-100 mb-6 font-normal">
                If you discover a security vulnerability, please report it to us immediately. We take all reports seriously and will respond within 24 hours.
              </p>
              <div className="space-y-2 text-purple-100">
                <p><strong className="text-white">Email:</strong> security@aiexamplatform.com</p>
                <p><strong className="text-white">PGP Key:</strong> Available upon request</p>
                <p className="text-sm mt-4">We offer rewards for responsible disclosure of security vulnerabilities.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
