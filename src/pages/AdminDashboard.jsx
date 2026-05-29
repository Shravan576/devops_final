import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_SALES_DATA, MOCK_CATEGORY_DATA } from '../data/mockData';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Server, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Layers, 
  X,
  Play
} from 'lucide-react';

export default function AdminDashboard() {
  const { products, addProduct, deleteProduct, orders, devopsMetrics, setDevopsMetrics } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Audio');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');

  // Calculations for stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 12500; // adding baseline mock sales
  const totalOrdersCount = orders.length + 85; // baseline mock orders
  const activeReplicas = devopsMetrics.activeReplicas;

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newName || !newPrice || !newStock) return;

    const imgUrl = newImage.trim() || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

    addProduct({
      name: newName,
      category: newCategory,
      price: parseInt(newPrice),
      stock: parseInt(newStock),
      description: newDescription || "No description provided.",
      image: imgUrl
    });

    // Reset Form
    setNewName('');
    setNewPrice('');
    setNewStock('');
    setNewDescription('');
    setNewImage('');
    setShowAddModal(false);
  };

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#3b82f6'];

  // Trigger simulated HPA load
  const triggerTrafficSpike = () => {
    setDevopsMetrics(prev => ({
      ...prev,
      ingressTrafficRate: 45, // Spike traffic
      cpuLoad: 88, // Spike CPU load
      pipelineStatus: "building" // Change pipeline status to simulate active deployment
    }));
    setTimeout(() => {
      setDevopsMetrics(prev => ({
        ...prev,
        pipelineStatus: "success"
      }));
    }, 8000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      
      {/* Header and DevOps Trigger Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            DevOps Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Orchestration and Analytics Node Panel
          </p>
        </div>
        
        {/* DevOps Demo Trigger */}
        <div className="flex items-center space-x-3">
          <button
            onClick={triggerTrafficSpike}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl text-xs font-semibold shadow-md transition glow-primary"
            title="Simulate high traffic requests to trigger Kubernetes horizontal autoscaler scaling"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Traffic Spike (HPA Trigger)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Revenue */}
        <div className="glass p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Aggregate Revenue</span>
            <h3 className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
              ${totalRevenue.toLocaleString()}
            </h3>
            <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">▲ +12% from last month</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Sales */}
        <div className="glass p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Total Orders</span>
            <h3 className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
              {totalOrdersCount}
            </h3>
            <span className="text-[10px] text-indigo-500 font-semibold mt-1 block">▲ +8% conversion rate</span>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: CPU utilization */}
        <div className="glass p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Prometheus Scraped CPU</span>
            <h3 className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
              {devopsMetrics.cpuLoad}%
            </h3>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">
              Load: {devopsMetrics.cpuLoad > 75 ? 'Critical (Scaling)' : 'Nominal'}
            </span>
          </div>
          <div className={`p-3 rounded-xl ${devopsMetrics.cpuLoad > 75 ? 'bg-rose-500/10 text-rose-500' : 'bg-violet-500/10 text-violet-500'}`}>
            <Server className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: K8s Replicas */}
        <div className="glass p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Kubernetes Replicas</span>
            <h3 className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
              {activeReplicas} Pods
            </h3>
            <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">
              ● All pods status: Healthy
            </span>
          </div>
          <div className="p-3 bg-indigo-550/10 text-indigo-500 dark:text-indigo-400 bg-indigo-500/15 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart 1: Sales Trend Area Chart */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4 flex items-center space-x-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span>Monthly Revenue Metrics ($)</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_SALES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} fontStyle="italic" />
                <YAxis stroke="#94A3B8" fontSize={10} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="Sales" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Allocation Bar Chart */}
        <div className="lg:col-span-1 glass p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">
            Category Contribution Value
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_CATEGORY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={8} />
                <YAxis stroke="#94A3B8" fontSize={10} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {MOCK_CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Kubernetes Cluster Nodes Monitor section */}
      <div className="glass rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm mb-8">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-xs uppercase tracking-wider font-mono">Live Kubernetes Replica Pods</span>
          </div>
          <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${devopsMetrics.pipelineStatus === 'building' ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {devopsMetrics.pipelineStatus === 'building' ? 'HPA Scaling Active' : 'Cluster Nominal'}
          </span>
        </div>

        <div className="p-4 bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead>
              <tr className="text-slate-500 border-b border-slate-850 pb-2 text-[10px]">
                <th className="pb-2">POD NAME</th>
                <th className="pb-2">READY</th>
                <th className="pb-2">STATUS</th>
                <th className="pb-2">RESTARTS</th>
                <th className="pb-2 text-right">AGE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {devopsMetrics.podsStatus.map((pod, i) => (
                <tr key={i} className="text-slate-300">
                  <td className="py-2.5 font-mono text-[11px]">{pod.name}</td>
                  <td className="py-2.5 text-emerald-400">1/1</td>
                  <td className="py-2.5">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${pod.status === 'Running' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-bounce'}`}></span>
                    {pod.status}
                  </td>
                  <td className="py-2.5">{pod.restarts}</td>
                  <td className="py-2.5 text-right text-slate-500">{pod.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Catalog & Inventory Table */}
      <div className="glass rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/60">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Catalog Product Inventory</h3>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left font-medium">
            <thead>
              <tr className="bg-slate-100/50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                <th className="p-4">Item Details</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Unit Price</th>
                <th className="p-4 text-center">Stock Level</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {products.map(prod => (
                <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-slate-700 dark:text-slate-300">
                  <td className="p-4 flex items-center space-x-3">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-800"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{prod.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {prod.id}</span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold">{prod.category}</td>
                  <td className="p-4 text-center font-mono font-bold">${prod.price}.00</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      prod.stock === 0 
                        ? 'bg-rose-500/10 text-rose-500' 
                        : prod.stock < 10 
                          ? 'bg-amber-500/10 text-amber-500' 
                          : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {prod.stock} units
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => deleteProduct(prod.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Add New Product to Cluster</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Smart Watch"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Peripherals">Peripherals</option>
                    <option value="Displays">Displays</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Networking">Networking</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Unit Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="250"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://unsplash.com/..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Short Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Write description details..."
                  rows="3"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex space-x-2 pt-2 justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  Deploy Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
