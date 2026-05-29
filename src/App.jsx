import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import { Server, Cpu, RefreshCw, Code } from 'lucide-react';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const { user } = useApp();

  // Route resolver
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'cart':
        return <Cart setCurrentView={setCurrentView} />;
      case 'orders':
        return <Orders />;
      case 'login':
        return <Login setCurrentView={setCurrentView} />;
      case 'admin':
        // If not logged in as admin, redirect to login page
        if (user?.role !== 'admin') {
          return <Login setCurrentView={setCurrentView} />;
        }
        return <AdminDashboard />;
      case 'profile':
        if (!user) {
          return <Login setCurrentView={setCurrentView} />;
        }
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      {/* Navigation */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {renderView()}
      </main>

      {/* DevOps Workflow Visualizer Widget (Before Footer) */}
      <section className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center mb-6 font-mono">
            Platform Orchestration Lifecycle Workflow
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto font-mono text-[10px] text-center">
            
            {/* Step 1: Code */}
            <div className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-850 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-2">
                <Code className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">1. Developer</h4>
              <p className="text-slate-400 mt-1 text-[9px]">React.js + Tailwind</p>
            </div>

            {/* Step 2: Push */}
            <div className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-850 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center mx-auto mb-2">
                <Server className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">2. Git Trigger</h4>
              <p className="text-slate-400 mt-1 text-[9px]">Webhook Webpush</p>
            </div>

            {/* Step 3: Build */}
            <div className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-850 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-2">
                <RefreshCw className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">3. Jenkins CD</h4>
              <p className="text-slate-400 mt-1 text-[9px]">Build, Lint, Dockerize</p>
            </div>

            {/* Step 4: Container */}
            <div className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-850 shadow-sm col-span-1">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-2">
                <Server className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">4. Docker Hub</h4>
              <p className="text-slate-400 mt-1 text-[9px]">Registry Push</p>
            </div>

            {/* Step 5: Kubernetes deploy */}
            <div className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-850 shadow-sm col-span-2 md:col-span-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                <Cpu className="w-4 h-4 animate-pulse" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">5. K8s / AWS</h4>
              <p className="text-slate-400 mt-1 text-[9px]">Rolling Deployments</p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-900 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs">
          <div>
            <p className="text-slate-500 font-medium">
              &copy; {new Date().getFullYear()} DevOps E-Commerce Project. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4 text-[10px] font-mono text-slate-400">
            <span className="flex items-center"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1"></span> Nginx Exporter</span>
            <span className="flex items-center"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-1"></span> Docker Compose</span>
            <span className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span> Prometheus</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
