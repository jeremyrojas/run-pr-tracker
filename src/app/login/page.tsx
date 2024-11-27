'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
      }
    } catch (err) {
      const error = err as { message: string };
      setError(error.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="max-w-md w-full space-y-8 bg-[var(--card-background)] p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--primary-blue)] to-[var(--secondary-blue)] text-transparent bg-clip-text mb-2">
            Run PR Tracker
          </h1>
          <p className="text-[var(--text-secondary)] text-base font-medium">
            Track your Personal Records
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] bg-[var(--background)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] bg-[var(--background)]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--primary-blue)] text-white py-4 px-6 rounded-xl font-semibold
                     hover:bg-[var(--secondary-blue)] transition-colors duration-200
                     shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[var(--primary-blue)] hover:text-[var(--secondary-blue)] font-medium"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 