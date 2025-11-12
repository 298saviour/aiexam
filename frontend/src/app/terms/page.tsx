'use client';

import { motion } from 'framer-motion';

export default function TermsOfServicePage() {
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
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">Terms of Service</h1>
            <p className="text-purple-200 mb-8 font-normal">Last updated: November 9, 2025</p>

            <div className="space-y-8 text-purple-100 font-normal">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using AI Exam Platform, you accept and agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. User Accounts</h2>
                <p className="mb-4">When creating an account, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Be responsible for all activities under your account</li>
                  <li>Not share your account with others</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Acceptable Use</h2>
                <p className="mb-4">You agree NOT to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use the platform for any illegal or unauthorized purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the platform's operation</li>
                  <li>Upload malicious code or viruses</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Attempt to cheat or manipulate exam results</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. AI Grading Service</h2>
                <p className="mb-4">Our AI grading service:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Uses GPT-4o-mini for automated grading</li>
                  <li>Achieves 95%+ accuracy but is not infallible</li>
                  <li>Should be reviewed by teachers before final publication</li>
                  <li>May be updated or improved over time</li>
                  <li>Requires clear, legible student responses for best results</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
                <p className="mb-4">
                  All content, features, and functionality of AI Exam Platform are owned by us and protected by 
                  international copyright, trademark, and other intellectual property laws.
                </p>
                <p className="mb-4">You retain ownership of:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Exam questions you create</li>
                  <li>Student responses and submissions</li>
                  <li>Your institution's data and content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Payment Terms</h2>
                <p className="mb-4">For paid subscriptions:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Fees are billed monthly or annually in advance</li>
                  <li>All fees are in Nigerian Naira (₦)</li>
                  <li>Refunds are provided within 14 days of initial purchase</li>
                  <li>You can cancel anytime; no refunds for partial months</li>
                  <li>We reserve the right to change pricing with 30 days notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Service Availability</h2>
                <p>
                  We strive for 99.9% uptime but do not guarantee uninterrupted service. We may perform maintenance, 
                  updates, or experience technical issues that temporarily affect availability.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
                <p className="mb-4">
                  AI Exam Platform is provided "as is" without warranties of any kind. We are not liable for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Errors in AI grading (though we strive for accuracy)</li>
                  <li>Data loss due to user error or technical issues</li>
                  <li>Indirect, incidental, or consequential damages</li>
                  <li>Third-party service failures</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Termination</h2>
                <p className="mb-4">We may terminate or suspend your account if you:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violate these Terms of Service</li>
                  <li>Fail to pay subscription fees</li>
                  <li>Engage in fraudulent or illegal activity</li>
                  <li>Abuse or misuse the platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Governing Law</h2>
                <p>
                  These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be 
                  resolved in Nigerian courts.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to Terms</h2>
                <p>
                  We may modify these terms at any time. Continued use of the platform after changes constitutes 
                  acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Us</h2>
                <p className="mb-2">For questions about these terms, contact us at:</p>
                <ul className="space-y-1 ml-4">
                  <li>Email: legal@aiexamplatform.com</li>
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
