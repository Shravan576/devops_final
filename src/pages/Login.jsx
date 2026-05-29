import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Server, ShieldCheck, UserCheck, KeyRound, Mail } from 'lucide-react';

export default function Login({ setCurrentView }) {
  const { login, user } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // user or admin
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    
    login(username, role);
    setCurrentView(role === 'admin' ? 'admin' : 'home');
  };

  const handleQuickLogin = (selectedRole) => {
    const defaultUser = selectedRole === 'admin' ? 'DevOpsAdmin' : 'DevOpsUser';
    login(defaultUser, selectedRole);
    setCurrentView(selectedRole === 'admin' ? 'admin' : 'home');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 page-transition">
      <div className="w-full max-w-md glass p-8 rounded-2xl shadow-xl relative overflow-hidden">
        
        {/* Glow decoration */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl"></div>

        <div className="flex flex-col items-center mb-6 relative">
          <div className="p-3 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-2xl shadow-lg text-white mb-3">
            <Server className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-center">
            Sign in to DevOpsCart
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
            Access secure containerized nodes
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative">
          {/* Role selection toggle */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Select Deployment Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border transition ${
                  role === 'user'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border transition ${
                  role === 'admin'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Administrator</span>
              </button>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/20 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Access Token / Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/20 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition shadow-md glow-primary hover:shadow-lg"
          >
            Authenticate Session
          </button>
        </form>

        <div className="mt-6 border-t border-slate-200/80 dark:border-slate-800/80 pt-5">
          <span className="block text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Quick presentation login
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('user')}
              className="py-2 px-3 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 transition"
            >
              Customer Mock
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="py-2 px-3 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 transition"
            >
              DevOps Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
