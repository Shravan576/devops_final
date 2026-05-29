import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  ShoppingCart, 
  User, 
  Bell, 
  Sun, 
  Moon, 
  Server, 
  LayoutDashboard,
  LogOut,
  Check,
  AlertTriangle
} from 'lucide-react';

export default function Navbar({ currentView, setCurrentView }) {
  const { 
    theme, 
    toggleTheme, 
    user, 
    logout, 
    cart, 
    notifications, 
    markAllRead 
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleNavClick = (view) => {
    setCurrentView(view);
    setShowNotifications(false);
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'system': return <Server className="w-4 h-4 text-indigo-500" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Project Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-xl shadow-md text-white">
              <Server className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                DevOpsCart
              </span>
              <span className="hidden md:block text-[10px] text-slate-500 font-mono">v1.2.4 (K8s Cluster)</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 font-medium">
            <button 
              onClick={() => handleNavClick('home')}
              className={`px-4 py-2 rounded-lg transition-all ${currentView === 'home' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 font-semibold' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
            >
              Shop Catalog
            </button>
            <button 
              onClick={() => handleNavClick('orders')}
              className={`px-4 py-2 rounded-lg transition-all ${currentView === 'orders' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 font-semibold' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
            >
              Order Status
            </button>

            {/* Admin view button - visually styled like a dashboard link */}
            <button 
              onClick={() => handleNavClick(user?.role === 'admin' ? 'admin' : 'login')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${currentView === 'admin' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 font-semibold' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>DevOps Dashboard</span>
            </button>
          </div>

          {/* Right Actions Menu */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications Panel */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 max-w-[90vw] glass border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-xl overflow-hidden animate-scale-in z-50">
                  <div className="p-3 border-b border-slate-200/80 dark:border-slate-800/80 flex justify-between items-center">
                    <h3 className="font-semibold text-sm">Cluster Alerts & Notices</h3>
                    {unreadNotifs > 0 && (
                      <button 
                        onClick={markAllRead}
                        className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No alerts or updates active.
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-3 border-b border-slate-100 dark:border-slate-800 flex space-x-3 text-xs leading-normal hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition ${!notif.read ? 'bg-indigo-50/20 dark:bg-indigo-950/10 font-medium' : ''}`}
                        >
                          <div className="mt-0.5">{getNotifIcon(notif.type)}</div>
                          <div className="flex-1">
                            <p className="text-slate-700 dark:text-slate-300">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 font-mono mt-1 block">{notif.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button 
              onClick={() => handleNavClick('cart')}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-tr from-indigo-500 to-violet-600 text-white rounded-full text-[10px] font-bold w-5 h-5 flex items-center justify-center border border-white dark:border-slate-900 shadow">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Profile Button */}
            {user ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button 
                  onClick={() => handleNavClick('profile')}
                  className="flex items-center space-x-1.5 p-1.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                    {user.username[0]}
                  </div>
                  <span className="hidden sm:inline text-xs font-mono">{user.username}</span>
                </button>
                <button 
                  onClick={() => {
                    logout();
                    handleNavClick('home');
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleNavClick('login')}
                className="flex items-center space-x-1.5 p-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-xs font-semibold shadow-md glow-primary"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Nav Bar Links */}
      <div className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 px-4 py-2 flex justify-around text-xs">
        <button 
          onClick={() => handleNavClick('home')}
          className={`flex flex-col items-center py-1 ${currentView === 'home' ? 'text-indigo-500 font-semibold' : 'text-slate-500'}`}
        >
          <span>Shop</span>
        </button>
        <button 
          onClick={() => handleNavClick('orders')}
          className={`flex flex-col items-center py-1 ${currentView === 'orders' ? 'text-indigo-500 font-semibold' : 'text-slate-500'}`}
        >
          <span>Orders</span>
        </button>
        <button 
          onClick={() => handleNavClick(user?.role === 'admin' ? 'admin' : 'login')}
          className={`flex flex-col items-center py-1 ${currentView === 'admin' ? 'text-indigo-500 font-semibold' : 'text-slate-500'}`}
        >
          <span>Cluster Dashboard</span>
        </button>
      </div>
    </nav>
  );
}
