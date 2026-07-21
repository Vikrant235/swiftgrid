'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import Login from './Login';
import SignUp from './SignUp';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Content */}
        <div className="p-8">
          {mode === 'login' ? (
            <Login
              onClose={onClose}
              onSwitchToSignUp={() => setMode('signup')}
            />
          ) : (
            <SignUp
              onClose={onClose}
              onSwitchToLogin={() => setMode('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
