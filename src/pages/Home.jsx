import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  TrendingUp, 
  Activity, 
  Cpu, 
  Layers,
  Heart,
  AlertCircle
} from 'lucide-react';

export default function Home() {
  const { products, addToCart, devopsMetrics, isDbActive } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [addedItem, setAddedItem] = useState(null);

  // Extract unique categories
  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Filtering & Sorting
  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured/default
    });

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 page-transition">
      
      {/* Dynamic DevOps Status Banner */}
      <div className="mb-8 p-4 bg-slate-900 text-slate-100 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between border border-slate-800 space-y-4 md:space-y-0 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center space-x-3 z-10">
          <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-600 text-white rounded-xl shadow">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide uppercase text-slate-300">Live Cluster Metrics</h4>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <p className="text-[10px] text-slate-400 font-mono">Minikube Cluster</p>
              <span className="text-slate-600 font-mono">|</span>
              <span className={`text-[10px] font-mono font-bold ${isDbActive ? 'text-emerald-400' : 'text-amber-400'}`}>
                DB: {isDbActive ? 'MongoDB Active' : 'LocalStorage Cache'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 md:gap-12 z-10 font-mono text-center">
          <div className="text-left md:text-center">
            <span className="text-[10px] text-slate-400 uppercase block">Cluster CPU</span>
            <div className="flex items-center space-x-1.5 md:justify-center mt-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span className={`text-sm font-bold ${devopsMetrics.cpuLoad > 80 ? 'text-rose-400' : devopsMetrics.cpuLoad > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {devopsMetrics.cpuLoad}%
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Active Pods</span>
            <div className="flex items-center space-x-1.5 justify-center mt-1">
              <Layers className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-sm font-bold text-slate-200">
                {devopsMetrics.activeReplicas} / 5
              </span>
            </div>
          </div>

          <div className="text-right md:text-center">
            <span className="text-[10px] text-slate-400 uppercase block">Pipeline</span>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase border border-emerald-500/30">
              Healthy
            </span>
          </div>
        </div>
      </div>

      {/* Hero Welcome Section */}
      <div className="text-center py-10 md:py-14 relative">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Smart E-Commerce Websites
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          Explore a fully responsive React storefront containerized using multi-stage Docker builds, controlled via Kubernetes Deployments, and delivered through an automated CI/CD pipeline.
        </p>
      </div>

      {/* Controls: Search, Filter, Sort */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 items-start">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 glass p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
            <Filter className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-sm tracking-wide text-slate-800 dark:text-slate-200 uppercase">Filters</h3>
          </div>

          {/* Search bar */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Search Catalog</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Categories</label>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    category === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              <option value="featured">Featured Product</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 glass rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No items match filters</h3>
              <p className="text-xs text-slate-500 mt-1">Try clearing your search or category filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div 
                  key={product.id}
                  className="bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col relative"
                >
                  {/* Category tag */}
                  <span className="absolute top-3 left-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full z-10 uppercase tracking-wider">
                    {product.category}
                  </span>

                  {/* Product Image */}
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  </div>

                  {/* Description Info */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center space-x-1.5 mb-1.5 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{product.rating}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({product.reviews})</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight group-hover:text-indigo-500 transition">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Stock Alert Info */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-mono">Inventory Stock</span>
                      {product.stock === 0 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded border border-rose-500/20 uppercase">
                          Out of Stock
                        </span>
                      ) : product.stock < 10 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20 uppercase animate-pulse">
                          Low Stock: {product.stock} left
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20 uppercase">
                          In Stock: {product.stock}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        ${product.price}.00
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className={`flex items-center space-x-1.5 px-3 py-1.8 rounded-lg text-xs font-semibold shadow-md transition ${
                          product.stock === 0
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                            : addedItem === product.id
                              ? 'bg-emerald-500 text-white shadow-none'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white glow-primary'
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{addedItem === product.id ? 'Added!' : 'Add to Cart'}</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
