import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Package, 
  Clock, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  AlertCircle,
  Play
} from 'lucide-react';

export default function Orders() {
  const { orders, setOrders } = useApp();
  const [expandedOrder, setExpandedOrder] = useState(null);

  const stepsList = [
    { label: "Order Placed", desc: "Pod received order package payload" },
    { label: "Processing", desc: "Verifying items inventory allocation" },
    { label: "Out for Delivery", desc: "Dispatched to local node router" },
    { label: "Delivered", desc: "Session completed successfully" }
  ];

  const toggleExpand = (id) => {
    setExpandedOrder(prev => prev === id ? null : id);
  };

  // Fun mock feature: advance order status step
  const handleAdvanceStep = (orderId, currentStep) => {
    if (currentStep >= 4) return;
    
    setOrders(prev => {
      return prev.map(order => {
        if (order.id === orderId) {
          const nextStep = currentStep + 1;
          let newStatus = "Order Placed";
          if (nextStep === 2) newStatus = "Processing";
          if (nextStep === 3) newStatus = "Out for Delivery";
          if (nextStep === 4) newStatus = "Delivered";

          return {
            ...order,
            step: nextStep,
            status: newStatus
          };
        }
        return order;
      });
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Order Router Console
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Tracking package pipeline instances
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 mt-1">Submit a cart to instantiate an order node.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const isExpanded = expandedOrder === order.id;
            return (
              <div 
                key={order.id}
                className="glass border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Header Info */}
                <div 
                  onClick={() => toggleExpand(order.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition space-y-4 sm:space-y-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">{order.id}</h3>
                      <span className="text-[10px] text-slate-400 flex items-center mt-0.5">
                        <Clock className="w-3 h-3 mr-1" />
                        {order.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-6">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 uppercase font-mono block">Order Total</span>
                      <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">${order.total}.00</span>
                    </div>

                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                        order.step === 4 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : order.step === 3
                            ? 'bg-sky-500/10 text-sky-500 border-sky-500/20'
                            : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <button className="text-slate-400 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details / Pipeline Stepper */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-850 p-6 bg-slate-50/30 dark:bg-slate-950/20 space-y-6">
                    
                    {/* Visual Stepper */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Pipeline Status Steps</h4>
                        
                        {order.step < 4 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvanceStep(order.id, order.step);
                            }}
                            className="flex items-center space-x-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-semibold transition shadow-sm"
                            title="Mock advancing status to simulate cloud scheduler updates"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>Simulate Next Step</span>
                          </button>
                        )}
                      </div>

                      {/* Desktop Horizontal Stepper */}
                      <div className="hidden md:grid grid-cols-4 gap-4 relative pt-2">
                        {/* Joining progress line */}
                        <div className="absolute top-7 left-8 right-8 h-0.5 bg-slate-200 dark:bg-slate-800 z-0">
                          <div 
                            className="h-full bg-indigo-600 transition-all duration-500" 
                            style={{ width: `${((order.step - 1) / 3) * 100}%` }}
                          ></div>
                        </div>

                        {stepsList.map((step, idx) => {
                          const stepNum = idx + 1;
                          const isDone = order.step >= stepNum;
                          const isActive = order.step === stepNum;
                          
                          return (
                            <div key={idx} className="flex flex-col items-center text-center relative z-10">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-mono font-bold text-xs transition duration-300 ${
                                isDone 
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                              }`}>
                                {isDone ? <Check className="w-4 h-4" /> : stepNum}
                              </div>
                              <span className={`text-xs font-bold mt-2.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                {step.label}
                              </span>
                              <span className="text-[10px] text-slate-400 mt-1 max-w-[120px] font-medium leading-tight">
                                {step.desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Mobile Vertical Stepper */}
                      <div className="md:hidden space-y-4 pt-1">
                        {stepsList.map((step, idx) => {
                          const stepNum = idx + 1;
                          const isDone = order.step >= stepNum;
                          const isActive = order.step === stepNum;

                          return (
                            <div key={idx} className="flex items-start space-x-3">
                              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center border font-mono font-bold text-xs ${
                                isDone 
                                  ? 'bg-indigo-600 text-white border-indigo-600' 
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                              }`}>
                                {isDone ? <Check className="w-3 h-3" /> : stepNum}
                              </div>
                              <div>
                                <h5 className={`text-xs font-bold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                  {step.label}
                                </h5>
                                <p className="text-[10px] text-slate-400">{step.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>

                    {/* Order Items Table */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Allocated Items</h4>
                      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-250/50 dark:border-slate-800/60 overflow-hidden text-xs">
                        <table className="w-full text-left font-medium border-collapse">
                          <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-850 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                              <th className="p-3">Product</th>
                              <th className="p-3 text-center">Qty</th>
                              <th className="p-3 text-right">Price</th>
                              <th className="p-3 text-right font-bold">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {order.items.map(item => (
                              <tr key={item.id} className="text-slate-700 dark:text-slate-300">
                                <td className="p-3 font-semibold">{item.name}</td>
                                <td className="p-3 text-center font-mono">{item.quantity}</td>
                                <td className="p-3 text-right font-mono">${item.price}.00</td>
                                <td className="p-3 text-right font-bold font-mono">${item.price * item.quantity}.00</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Shipping Address Details */}
                    {order.shippingDetails && (
                      <div className="border-t border-slate-150/80 dark:border-slate-800 pt-5 flex items-start space-x-3 text-xs leading-normal">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200">Delivery Destination Node</h4>
                          <p className="text-slate-500 mt-0.5">
                            {order.shippingDetails.name} <br />
                            {order.shippingDetails.address}, {order.shippingDetails.city} - {order.shippingDetails.postalCode}
                          </p>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
