import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Chrome, User as UserIcon, ChevronRight, Shield } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Button } from '../components/Button';

export function Login() {
  const nav = useNavigate();
  const { login } = useApp();
  const [mode, setMode] = useState<'hero' | 'email'>('hero');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = email.split('@')[0]?.replace(/[._]/g, ' ') || 'Player';
    login(name.replace(/\b\w/g, (c) => c.toUpperCase()), email);
    nav('/home');
  };

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden max-w-md mx-auto">
      {/* Stadium background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 pitch-stripe opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-bg" />
        {/* stadium lights */}
        <motion.div
          className="absolute top-10 left-1/4 w-32 h-32 rounded-full bg-primary/10 blur-3xl"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-20 right-1/4 w-40 h-40 rounded-full bg-primary/10 blur-3xl"
          animate={{ opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen px-6 pt-16 pb-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-black mb-4">
            <span className="text-3xl font-black">S</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Statify AI</h1>
          <p className="text-text-secondary text-sm mt-1">Your Personal Fantasy Football Manager</p>
        </motion.div>

        <div className="flex-1 flex flex-col justify-end">
          {mode === 'hero' ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-3"
            >
              <Button onClick={() => setMode('email')} size="lg" className="w-full">
                <Mail size={20} /> Continue with Email
              </Button>
              <Button
                onClick={() => { login('Alex Morgan', 'alex@statify.ai'); nav('/home'); }}
                variant="secondary" size="lg" className="w-full"
              >
                <Chrome size={20} /> Continue with Google
              </Button>
              <Button
                onClick={() => { login('Guest', ''); nav('/home'); }}
                variant="ghost" size="lg" className="w-full border border-border"
              >
                <UserIcon size={20} /> Continue as Guest
              </Button>
              <p className="text-center text-[11px] text-text-secondary mt-4 flex items-center justify-center gap-1">
                <Shield size={12} /> Secured by Statify. No spam, ever.
              </p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-card p-5 space-y-4"
            >
              <div className="text-center mb-2">
                <h2 className="text-lg font-bold">Welcome back</h2>
                <p className="text-xs text-text-secondary">Sign in to manage your squad</p>
              </div>
              <div>
                <label className="text-xs text-text-secondary font-medium">Email</label>
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@statify.ai"
                  className="w-full mt-1 bg-white/5 border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-text-secondary font-medium">Password</label>
                <input
                  type="password" required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mt-1 bg-white/5 border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                />
              </div>
              <Button type="submit" size="lg" className="w-full">
                Sign In <ChevronRight size={18} />
              </Button>
              <button
                type="button"
                onClick={() => setMode('hero')}
                className="w-full text-center text-xs text-text-secondary"
              >
                ← Back to options
              </button>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}
