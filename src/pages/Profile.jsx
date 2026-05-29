import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Shield, Terminal, Key, Database, RefreshCw, Cpu } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useApp();

  const handleResetSystem = () => {
    if (confirm("This will clear your local cart, products, and order history, resetting the workspace to default files. Proceed?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const currentRole = user?.role === 'admin' ? 'Administrator' : 'Standard Customer';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 page-transition">
      <div className="glass rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-md mb-8">
        {/* Banner Decoration */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
          <div className="absolute -bottom-10 left-8">
            <div className="w-20 h-20 bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-950 rounded-2xl flex items-center justify-center text-indigo-500 shadow-md">
              <User className="w-10 h-10" />
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="pt-14 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-5">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {user ? user.username : 'Guest Session'}
              </h2>
              <span className="text-xs font-mono text-indigo-500 flex items-center mt-1">
                <Shield className="w-3.5 h-3.5 mr-1" />
                Role: {currentRole}
              </span>
            </div>
          </div>

          {/* Dev credentials / DevOps status widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            
            {/* Developer AWS & Git Details Card */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4 flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-indigo-500" />
                <span>DevOps Console Access Tokens</span>
              </h3>
              
              <div className="space-y-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Git Account ID:</span>
                  <span className="text-slate-950 dark:text-slate-200">git-developer-01</span>
                </div>
                <div className="flex justify-between">
                  <span>Kubernetes Namespace:</span>
                  <span className="px-1.5 py-0.2 bg-indigo-500/10 text-indigo-500 rounded">production</span>
                </div>
                <div className="flex justify-between">
                  <span>AWS Access Key Status:</span>
                  <span className="text-emerald-500">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Cluster Subdomain:</span>
                  <span className="text-slate-950 dark:text-slate-200">ecommerce.devops.local</span>
                </div>
              </div>
            </div>

            {/* Presentation Highlights List */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4 flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-indigo-500" />
                <span>Architecture Highlights</span>
              </h3>
              
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  <span><strong>Multi-stage Docker:</strong> Compact build sizes under 30MB</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  <span><strong>K8s Scaling:</strong> HPA configuration based on target CPU metrics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  <span><strong>Pipeline:</strong> Standardized checkout, build, tag, push & deploy stages</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Database Reset Action */}
          <div className="mt-8 border-t border-slate-100 dark:border-slate-850 pt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Storage Control Console</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Reset cached state variables back to factory defaults.</p>
            </div>
            <button
              onClick={handleResetSystem}
              className="flex items-center space-x-1.5 px-4 py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-xl text-xs font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Local Database</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
