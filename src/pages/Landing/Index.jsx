import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-surface text-text-primary">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-xl">📸</span>
            </div>
            <span className="text-2xl font-bold text-text-primary">Snapshot</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-text-secondary hover:text-accent transition-colors">
              Product
            </a>
            <a href="#pricing" className="text-text-secondary hover:text-accent transition-colors">
              Pricing
            </a>
            <RouterLink
              to="/login"
              className="text-text-secondary hover:text-accent transition-colors"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/signup"
              className="btn-primary px-6 py-2"
            >
              Get Started
            </RouterLink>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Collaborative Event Photo Albums.{' '}
            <span className="text-accent">Simple. Elegant.</span>
          </h1>
          <p className="text-lg text-text-secondary mb-8 max-w-lg">
            Create beautiful, collaborative photo albums for your events. Let your guests upload their best moments instantly.
          </p>
          <div className="flex gap-4">
            <RouterLink to="/signup" className="btn-primary px-8 py-3 text-lg">
              Create Your Event Album
            </RouterLink>
            <button className="btn-secondary px-8 py-3 text-lg">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Hero Grid of Photos */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-accent-light to-accent rounded-2xl shadow-md" />
            <div className="aspect-video bg-gradient-to-br from-accent-light to-accent rounded-2xl shadow-md" />
          </div>
          <div className="space-y-4 pt-8">
            <div className="aspect-video bg-gradient-to-br from-accent-light to-accent rounded-2xl shadow-md" />
            <div className="aspect-square bg-gradient-to-br from-accent-light to-accent rounded-2xl shadow-md" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="features" className="bg-white py-20 border-t border-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How it works</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Three simple steps to collect memories from your event
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="card">
              <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-bold mb-2">1. Create Event</h3>
              <p className="text-text-secondary">
                Create your event, upload your cover photo, and set the date for your album.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card">
              <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold mb-2">2. Share Link/QR</h3>
              <p className="text-text-secondary">
                Share a link or QR code with your guests. Perfect for scanning at the event.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card">
              <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-4">
                <span className="text-2xl">📤</span>
              </div>
              <h3 className="text-xl font-bold mb-2">3. Guests Upload</h3>
              <p className="text-text-secondary">
                Guests upload photos and videos directly. All in one beautiful, organized place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Pricing</h2>
            <p className="text-lg text-text-secondary">
              Choose the perfect plan for your events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter Plan */}
            <div className="card">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-accent">$1</span>
                <span className="text-text-secondary">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  <span>Event processores</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  <span>Event Album</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  <span>Coachate features</span>
                </li>
              </ul>
              <button className="btn-secondary w-full py-3">Select Plan</button>
            </div>

            {/* Pro Plan */}
            <div className="card border-2 border-accent">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-accent">$10</span>
                <span className="text-text-secondary">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  <span>Event processores</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  <span>Event Album</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  <span>Corporate features</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  <span>Primary Integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  <span>Palmers evaluation</span>
                </li>
              </ul>
              <button className="btn-primary w-full py-3">Select Plan</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to capture your memories?</h2>
          <p className="text-lg mb-8 text-accent-light">
            Start creating beautiful event albums today
          </p>
          <RouterLink to="/signup" className="inline-block bg-white text-accent px-8 py-3 rounded-lg font-semibold hover:bg-surface transition-colors">
            Get Started Free
          </RouterLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-surface-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-secondary">
          <p>&copy; 2024 Snapshot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
