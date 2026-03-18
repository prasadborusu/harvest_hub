import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageCode } from '../types';

const ROLES = [
  { key: 'farmer', label: 'Farmer', emoji: '🧑‍🌾', color: 'border-green-400 bg-green-50  hover:bg-green-100 text-green-800' },
  { key: 'buyer', label: 'Buyer', emoji: '🛒', color: 'border-blue-400  bg-blue-50   hover:bg-blue-100  text-blue-800' },
  { key: 'seller', label: 'Seller', emoji: '🏪', color: 'border-amber-400 bg-amber-50  hover:bg-amber-100 text-amber-800' },
];
const PASSWORDS: Record<string, string> = { farmer: 'farmer123', buyer: 'buyer123', seller: 'seller123' };

const Auth: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { language, setLanguage } = useLanguage();

  const doLogin = async (u: string, p: string) => {
    setError(null); setLoading(true);
    try { await login(u, p); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) { setError('Please enter a username.'); return; }
    if (!password) { setError('Please enter a password.'); return; }
    doLogin(username.trim().toLowerCase(), password);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#052e16 0%,#14532d 40%,#15803d 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-green-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-300/20 blur-3xl pointer-events-none" />

      {/* Language selector */}
      <div className="absolute top-5 right-5 z-10">
        <select
          value={language}
          onChange={e => setLanguage(e.target.value as LanguageCode)}
          className="text-sm border border-white/30 rounded-lg px-3 py-1.5 bg-white/10 text-white backdrop-blur focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value={LanguageCode.ENGLISH} className="text-gray-800">English</option>
          <option value={LanguageCode.HINDI} className="text-gray-800">हिन्दी</option>
          <option value={LanguageCode.TELUGU} className="text-gray-800">తెలుగు</option>
          <option value={LanguageCode.MALAYALAM} className="text-gray-800">മലയാളം</option>
        </select>
      </div>

      {/* Hero */}
      <div className="text-center mb-8 animate-fade-in">
        <p className="text-6xl mb-3 drop-shadow-lg">🌱</p>
        <h1 className="text-4xl font-black text-white tracking-tight">HarvestHub</h1>
        <p className="text-green-200 mt-2 text-base font-medium">Farm-to-Market Platform</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm mx-4 glass rounded-3xl shadow-2xl p-7 animate-fade-in">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-1">Welcome Back</h2>
        <p className="text-center text-gray-500 text-sm mb-5">Sign in to your account</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
            <span>⚠️</span><span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 block">Username</label>
            <input
              type="text" value={username} onChange={e => setUsername(e.target.value)}
              autoComplete="username" placeholder="farmer / buyer / seller"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 block">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password" placeholder="Enter your password"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-sm disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        {/* Quick login */}
        <div className="mt-6">
          <p className="text-center text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Quick Login</p>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map(r => (
              <button
                key={r.key}
                disabled={loading}
                onClick={() => { setUsername(r.key); setPassword(PASSWORDS[r.key]); doLogin(r.key, PASSWORDS[r.key]); }}
                className={`border-2 rounded-2xl py-3 px-2 flex flex-col items-center gap-1 transition-all active:scale-95 disabled:opacity-50 ${r.color}`}
              >
                <span className="text-2xl">{r.emoji}</span>
                <span className="text-xs font-bold">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hint */}
        <div className="mt-5 rounded-xl bg-gray-50 border border-gray-100 p-3 text-xs text-gray-500 space-y-1">
          <p className="font-semibold text-gray-600 text-xs mb-1">Credentials</p>
          {ROLES.map(r => (
            <p key={r.key}>{r.emoji} <span className="font-mono">{r.key}</span> / <span className="font-mono">{PASSWORDS[r.key]}</span></p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Auth;
