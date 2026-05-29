import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, MOCK_NOTIFICATIONS } from '../data/mockData';

const AppContext = createContext();

// Dynamic API Backend URI Resolution
const getBackendUrl = () => {
  const origin = window.location.origin;
  if (origin.includes('localhost') && !origin.includes(':8080')) {
    return 'http://localhost:5000';
  }
  try {
    const url = new URL(origin);
    // If accessing via Docker container port 8080, route API to port 5000
    if (url.port === '8080') {
      url.port = '5000';
    } else if (!url.port) {
      // If deployed on EC2 standard port 80, assume backend is exposed on port 5000
      url.port = '5000';
    }
    return url.origin;
  } catch (e) {
    return 'http://localhost:5000';
  }
};

const BACKEND_URL = getBackendUrl();

export const AppProvider = ({ children }) => {
  // --- THEME ---
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // --- USER AUTH ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username, role) => {
    const userData = { username, role };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    // Async attempt to log in on backend
    try {
      await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, role })
      });
    } catch (e) {
      console.log('Backend offline, running authentication in local fallback mode.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // --- HYBRID DATABASE & MOCK STATE ---
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState([]);
  const [isDbActive, setIsDbActive] = useState(false);

  // Sync products and orders on mount
  useEffect(() => {
    const fetchClusterData = async () => {
      try {
        console.log(`Connecting to backend API at: ${BACKEND_URL}`);
        
        // 1. Check Health
        const healthRes = await fetch(`${BACKEND_URL}/api/health`);
        const health = await healthRes.json();
        
        if (health.status === 'healthy') {
          console.log('Backend connected. Fetching products from MongoDB...');
          
          // 2. Fetch Products
          const prodRes = await fetch(`${BACKEND_URL}/api/products`);
          const prodData = await prodRes.json();
          setProducts(prodData);

          // 3. Fetch Orders
          const ordRes = await fetch(`${BACKEND_URL}/api/orders`);
          const ordData = await ordRes.json();
          setOrders(ordData);
          
          setIsDbActive(true);
        } else {
          loadFallbackData();
        }
      } catch (err) {
        console.warn('Backend database offline. Falling back to local storage cache.');
        loadFallbackData();
      }
    };

    fetchClusterData();
  }, []);

  const loadFallbackData = () => {
    setIsDbActive(false);
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
    }

    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      const defaultOrders = [
        {
          id: "ORD-9281",
          date: "2026-05-27",
          items: [
            { id: 1, name: "QuantumPro ANC Headphones", price: 299, quantity: 1 }
          ],
          total: 299,
          status: "Delivered",
          step: 4
        }
      ];
      setOrders(defaultOrders);
      localStorage.setItem('orders', JSON.stringify(defaultOrders));
    }
  };

  // --- CATALOG MUTATIONS (ADD / DELETE) ---
  const addProduct = async (product) => {
    if (isDbActive) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        });
        const newProduct = await res.json();
        setProducts(prev => [newProduct, ...prev]);
        return;
      } catch (e) {
        console.error('Failed to add product to MongoDB. Switching to local logic.');
      }
    }

    // Fallback Local Storage Mode
    const newProduct = {
      ...product,
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      rating: 5.0,
      reviews: 0
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
  };

  const deleteProduct = async (id) => {
    if (isDbActive) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setProducts(prev => prev.filter(p => p.id !== id));
          return;
        }
      } catch (e) {
        console.error('Failed to delete product from MongoDB. Switching to local logic.');
      }
    }

    // Fallback Local Storage Mode
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
  };

  // --- SHOPPING CART STATE ---
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // --- CHECKOUT SUBMISSIONS ---
  const checkout = async (shippingDetails) => {
    if (cart.length === 0) return;
    
    const newOrder = {
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: "Order Placed",
      step: 1,
      shippingDetails
    };

    if (isDbActive) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder)
        });
        if (res.ok) {
          const dbOrder = await res.json();
          setOrders(prev => [dbOrder, ...prev]);
          
          // Re-fetch products to sync dynamic Mongo stock counts
          const prodRes = await fetch(`${BACKEND_URL}/api/products`);
          const prodData = await prodRes.json();
          setProducts(prodData);

          clearCart();
          pushNotification('order', `New MongoDB Order ${dbOrder.id} logged ($${dbOrder.total})`);
          return dbOrder.id;
        }
      } catch (e) {
        console.error('Failed to submit order to Express backend. Fallback to LocalStorage.');
      }
    }

    // Local Storage Fallback Mode
    setProducts(prev => {
      const nextProds = prev.map(prod => {
        const cartItem = cart.find(c => c.id === prod.id);
        if (cartItem) {
          return { ...prod, stock: Math.max(0, prod.stock - cartItem.quantity) };
        }
        return prod;
      });
      localStorage.setItem('products', JSON.stringify(nextProds));
      return nextProds;
    });

    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    localStorage.setItem('orders', JSON.stringify(nextOrders));
    
    clearCart();
    pushNotification('order', `Order ${newOrder.id} saved to local storage cache.`);
    return newOrder.id;
  };

  // --- ALERTS & NOTIFICATIONS ---
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const pushNotification = (type, message) => {
    const notif = {
      id: Date.now(),
      type,
      message,
      time: "Just now",
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // --- DYNAMIC CLUSTER TELEMETRY SIMULATOR ---
  const [devopsMetrics, setDevopsMetrics] = useState({
    cpuLoad: 18,
    memoryUsage: 64,
    activeReplicas: 3,
    podsStatus: [
      { name: "frontend-deploy-67d4f9b88a-abcde", status: "Running", restarts: 0, age: "2d" },
      { name: "backend-deploy-54f9a3bcd1-fghij", status: "Running", restarts: 0, age: "2d" },
      { name: "mongodb-0", status: "Running", restarts: 0, age: "5d" }
    ],
    ingressTrafficRate: 12,
    pipelineStatus: "success",
    lastBuildNumber: 42,
    lastBuildDuration: "2m 14s",
    activeAlertsCount: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDevopsMetrics(prev => {
        const trafficDelta = Math.floor(Math.random() * 5) - 2;
        const newTraffic = Math.max(4, prev.ingressTrafficRate + trafficDelta);
        const newCpu = Math.min(95, Math.max(10, Math.floor(newTraffic * 2.1 + Math.random() * 8)));
        
        let replicas = prev.activeReplicas;
        let newPods = [...prev.podsStatus];

        if (newCpu > 70 && replicas < 5) {
          replicas += 1;
          const randomStr = Math.random().toString(36).substring(2, 7);
          newPods.push({
            name: `backend-deploy-54f9a3bcd1-${randomStr}`,
            status: "Creating",
            restarts: 0,
            age: "1s"
          });
          pushNotification('system', `HPA scaling: Provisioned new API replica pod due to cpu traffic spike.`);
        } else if (newCpu < 25 && replicas > 3) {
          replicas -= 1;
          // remove last dynamic pod
          newPods = newPods.filter((p, i) => i !== newPods.length - 1);
          pushNotification('system', `Scale down cooldown: Terminated idle replica pod.`);
        }

        newPods = newPods.map(pod => {
          if (pod.status === "Creating") {
            return { ...pod, status: "Running", age: "5s" };
          }
          return pod;
        });

        return {
          ...prev,
          cpuLoad: newCpu,
          activeReplicas: replicas,
          podsStatus: newPods,
          ingressTrafficRate: newTraffic,
          memoryUsage: Math.min(85, Math.max(50, 58 + Math.floor(replicas * 3)))
        };
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [products]);

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      user,
      login,
      logout,
      products,
      addProduct,
      deleteProduct,
      cart,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      orders,
      setOrders,
      checkout,
      notifications,
      markAllRead,
      clearNotifications,
      devopsMetrics,
      setDevopsMetrics,
      isDbActive,
      backendUrl: BACKEND_URL
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
