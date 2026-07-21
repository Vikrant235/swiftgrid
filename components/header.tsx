'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isLoggedIn?: boolean;
  userInitials?: string;
}

export default function Header({ isLoggedIn = false, userInitials = 'SG' }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-sm">SG</span>
            </div>
            <span className="font-bold text-lg text-foreground">SwiftGrid</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {!isLoggedIn ? (
              <>
                <Button variant="ghost" className="text-foreground hover:bg-muted hover:text-foreground">
                  Log In
                </Button>
                <Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Sign Up
                </Button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-9 h-9 rounded-full bg-primary/20 hover:bg-primary/30 transition flex items-center justify-center border border-primary/30"
                >
                  <span className="text-xs font-semibold text-primary">{userInitials}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                    <button className="w-full text-left px-4 py-2 hover:bg-muted text-sm text-foreground rounded-t-lg">
                      Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-muted text-sm text-foreground">
                      Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-destructive text-sm text-destructive rounded-b-lg">
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
