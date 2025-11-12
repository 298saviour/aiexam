'use client';

import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
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

      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/20"
          >
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">Privacy Policy</h1>
            <p className="text-purple-200 mb-8 font-normal">Last updated: November 9, 2025</p>

            <div className="space-y-8 text-purple-100 font-normal">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                <p className="mb-4">We collect information that you provide directly to us, including:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name, email address, and contact information</li>
                  <li>School or institution details</li>
                  <li>Exam responses and academic performance data</li>
                  <li>Usage data and analytics</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process and grade examinations using AI</li>
                  <li>Generate performance analytics and reports</li>
                  <li>Communicate with you about updates and support</li>
                  <li>Ensure platform security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Data Security</h2>
                <p className="mb-4">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>End-to-end encryption for data transmission</li>
                  <li>Secure database storage with regular backups</li>
                  <li>Role-based access control</li>
                  <li>Regular security audits and updates</li>
                  <li>Compliance with GDPR and Nigerian data protection laws</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Data Sharing</h2>
                <p className="mb-4">
                  We do not sell your personal information. We may share data with:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>OpenAI (for AI grading services, anonymized)</li>
                  <li>Cloud service providers (AWS, Google Cloud)</li>
                  <li>Payment processors (for billing)</li>
                  <li>Legal authorities (when required by law)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Export your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Children's Privacy</h2>
                <p>
                  Our platform is designed for educational institutions. Students under 18 must have parental or 
                  guardian consent. We do not knowingly collect data from children without proper authorization.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar technologies to improve user experience, analyze usage, and provide 
                  personalized content. You can manage cookie preferences in your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to This Policy</h2>
                <p>
                  We may update this privacy policy from time to time. We will notify you of significant changes 
                  via email or platform notification.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Us</h2>
                <p className="mb-2">If you have questions about this privacy policy, contact us at:</p>
                <ul className="space-y-1 ml-4">
                  <li>Email: privacy@aiexamplatform.com</li>
                  <li>Phone: +234 800 123 4567</li>
                  <li>Address: Lagos, Nigeria</li>
                </ul>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
