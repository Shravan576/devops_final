import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, CheckCircle, Package } from 'lucide-react';

export default function Cart({ setCurrentView }) {
  const { cart, updateCartQty, removeFromCart, checkout } = useApp();
  const [shippingName, setShippingName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmedId, setOrderConfirmedId] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedPromo ? Math.round(subtotal * 0.1) : 0; // 10% off
  const shippingFee = subtotal > 200 ? 0 : 15;
  const total = subtotal - discount + shippingFee;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'DEVOPS10') {
      setAppliedPromo(true);
      setPromoCode('');
    } else {
      alert('Invalid code! Try "DEVOPS10" for a 10% discount.');
    }
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!shippingName || !address || !city || !postalCode) {
      alert('Please fill in all shipping fields');
      return;
    }
    
    const shippingDetails = { name: shippingName, address, city, postalCode };
    const orderId = checkout(shippingDetails);
    
    // Set confirmed state
    setOrderConfirmedId(orderId);
    setIsCheckingOut(false);
  };

  // If order is completed
  if (orderConfirmedId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center page-transition">
        <div className="glass p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
          {/* Confirmed Animation */}
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Order Confirmed!</h2>
          <p className="text-sm font-mono text-indigo-500 mt-2">ID: {orderConfirmedId}</p>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 leading-relaxed max-w-md mx-auto">
            Your e-commerce order has been successfully logged. The Jenkins pipeline is monitoring the microservices for delivery scheduling.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
            <button
              onClick={() => setCurrentView('orders')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition shadow-md glow-primary"
            >
              Track Deliveries
            </button>
            <button
              onClick={() => {
                setOrderConfirmedId(null);
                setCurrentView('home');
              }}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold rounded-xl text-xs transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center page-transition">
        <div className="glass p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-md">
          <ShoppingCart className="w-16 h-16 text-slate-400 mx-auto mb-6 animate-bounce" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
            No items have been assigned to your pod. Browse our catalog of next-generation gadgets.
          </p>
          <button
            onClick={() => setCurrentView('home')}
            className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition shadow-md glow-primary"
          >
            Go to Shop Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">
        Shopping Cart Console
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center space-x-2">
              <Package className="w-4 h-4 text-indigo-500" />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-500">Cart Contents</span>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {cart.map(item => (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                  
                  {/* Image & Title */}
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200/50 dark:border-slate-800"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{item.category}</span>
                      <span className="text-xs text-indigo-500 font-semibold mt-1 block">${item.price}.00</span>
                    </div>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className="flex items-center justify-between w-full sm:w-auto space-x-6 sm:space-x-8">
                    <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 p-1">
                      <button 
                        onClick={() => updateCartQty(item.id, -1)}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition text-slate-500"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQty(item.id, 1)}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition text-slate-500"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                        ${item.price * item.quantity}.00
                      </span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary & Checkout Form */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Cost breakdown */}
          <div className="glass p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h3 className="font-bold text-sm tracking-wide text-slate-800 dark:text-slate-200 uppercase border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              Order Summary
            </h3>
            
            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal}.00</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-500">
                  <span>10% Discount</span>
                  <span className="font-mono">-${discount}.00</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Kubernetes Shipping Node</span>
                <span className="font-mono">{shippingFee === 0 ? 'FREE' : `$${shippingFee}.00`}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                <span>Estimated Total</span>
                <span className="font-mono">${total}.00</span>
              </div>
            </div>

            {/* Promo Code Form */}
            {!appliedPromo ? (
              <form onSubmit={handleApplyPromo} className="flex space-x-2 pt-2">
                <input 
                  type="text" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Code (DEVOPS10)" 
                  className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                />
                <button 
                  type="submit"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 transition"
                >
                  Apply
                </button>
              </form>
            ) : (
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-[10px] font-bold text-center">
                Code "DEVOPS10" Applied!
              </div>
            )}

            {!isCheckingOut && (
              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-2 shadow-md glow-primary"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Checkout Details Sheet (Slide-down toggle) */}
          {isCheckingOut && (
            <div className="glass p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-4 animate-slide-down">
              <h3 className="font-bold text-sm tracking-wide text-slate-800 dark:text-slate-200 uppercase border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                Shipping Console
              </h3>
              
              <form onSubmit={handleCheckoutSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Cluster Way"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Tech City"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="400001"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-md transition"
                  >
                    Confirm Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
