'use client';

import { motion } from 'framer-motion';

export default function CookiePolicyPage() {
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
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">Cookie Policy</h1>
            <p className="text-purple-200 mb-8 font-normal">Last updated: November 9, 2025</p>

            <div className="space-y-8 text-purple-100 font-normal">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies?</h2>
                <p>
                  Cookies are small text files stored on your device when you visit our website. They help us provide 
                  a better user experience by remembering your preferences and analyzing how you use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">1. Essential Cookies (Required)</h3>
                    <p className="mb-2">These cookies are necessary for the platform to function:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Authentication tokens (keep you logged in)</li>
                      <li>Session management</li>
                      <li>Security features</li>
                      <li>Load balancing</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">2. Functional Cookies (Optional)</h3>
                    <p className="mb-2">These cookies enhance your experience:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Language preferences</li>
                      <li>Theme settings (dark/light mode)</li>
                      <li>Dashboard layout preferences</li>
                      <li>Recently viewed items</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">3. Analytics Cookies (Optional)</h3>
                    <p className="mb-2">These cookies help us understand how you use our platform:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Page views and navigation patterns</li>
                      <li>Feature usage statistics</li>
                      <li>Performance metrics</li>
                      <li>Error tracking</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">4. Marketing Cookies (Optional)</h3>
                    <p className="mb-2">These cookies help us show you relevant content:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Personalized recommendations</li>
                      <li>Targeted announcements</li>
                      <li>Campaign effectiveness</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Cookies</h2>
                <p className="mb-4">We may use third-party services that set their own cookies:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Google Analytics:</strong> For usage analytics and insights</li>
                  <li><strong className="text-white">Cloudflare:</strong> For security and performance</li>
                  <li><strong className="text-white">Stripe:</strong> For payment processing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Managing Cookies</h2>
                <p className="mb-4">You have control over cookies:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Cookie Banner:</strong> Accept or decline optional cookies when you first visit</li>
                  <li><strong className="text-white">Browser Settings:</strong> Block or delete cookies through your browser</li>
                  <li><strong className="text-white">Account Settings:</strong> Manage preferences in your dashboard</li>
                </ul>
                <p className="mt-4">
                  Note: Blocking essential cookies may prevent the platform from functioning properly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Cookie Duration</h2>
                <p className="mb-4">Cookies have different lifespans:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Session Cookies:</strong> Deleted when you close your browser</li>
                  <li><strong className="text-white">Persistent Cookies:</strong> Remain for a set period (typically 30-365 days)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Your Consent</h2>
                <p>
                  By clicking "Accept All Cookies" on our cookie banner, you consent to our use of optional cookies. 
                  You can withdraw consent at any time by changing your cookie preferences.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Updates to This Policy</h2>
                <p>
                  We may update this cookie policy to reflect changes in technology or regulations. We'll notify you 
                  of significant changes via email or platform notification.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
                <p className="mb-2">Questions about our cookie policy? Contact us at:</p>
                <ul className="space-y-1 ml-4">
                  <li>Email: privacy@aiexamplatform.com</li>
                  <li>Phone: +234 800 123 4567</li>
                </ul>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
