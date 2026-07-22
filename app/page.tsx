'use client';

import Header from '@/components/header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Eye, Cpu } from 'lucide-react';

export default function LandingPage() {
  return (
    <>
      <Header isLoggedIn={false} />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-card to-background py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 md:space-y-8">
              <div className="space-y-3">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance leading-tight">
                  A lightning-fast, privacy-first visual CSV editor
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                  Handle massive datasets purely in your browser—no databases, no visual overstimulation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/editor">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground group">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border hover:bg-muted text-foreground"
                >
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-background py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Engineered for Performance
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Three technical pillars that make SwiftGrid fast, secure, and efficient.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {/* Feature 1 */}
              <div className="bg-card border border-border rounded-xl p-6 md:p-8 hover:border-primary/50 transition">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Stateless Architecture (OPFS)
                </h3>
                <p className="text-muted-foreground">
                  No server uploads, no state management nightmares. All processing happens locally using the Origin Private File System.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-card border border-border rounded-xl p-6 md:p-8 hover:border-primary/50 transition">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Visual Block Merging
                </h3>
                <p className="text-muted-foreground">
                  Drag, drop, and merge multi-gigabyte CSV files visually. See data as proportional blocks instead of drowning in rows.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-card border border-border rounded-xl p-6 md:p-8 hover:border-primary/50 transition">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Browser-Native Worker Processing
                </h3>
                <p className="text-muted-foreground">
                  Leverages Web Workers for background processing. No freezing, no lag, even with massive files.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-card border-t border-border py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to process data faster?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join data analysts, e-commerce managers, and web scrapers who trust SwiftGrid for privacy-first CSV processing.
            </p>
            <Link href="/editor">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Start for Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Dashboard</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2024 SwiftGrid. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition">Twitter</Link>
              <Link href="#" className="hover:text-foreground transition">GitHub</Link>
              <Link href="#" className="hover:text-foreground transition">Discord</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
