export const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "QuantumPro ANC Headphones",
    category: "Audio",
    price: 299,
    rating: 4.8,
    reviews: 142,
    stock: 24,
    description: "Next-generation Active Noise Cancelling headphones featuring custom-tuned 40mm dynamic drivers and 45-hour battery life.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    name: "Nebula RGB Mechanical Keyboard",
    category: "Peripherals",
    price: 149,
    rating: 4.6,
    reviews: 88,
    stock: 15,
    description: "Hot-swappable mechanical keyboard with custom linear switches, PBT double-shot keycaps, and vibrant per-key RGB backlighting.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    name: "Apex 27\" QHD IPS Monitor",
    category: "Displays",
    price: 389,
    rating: 4.9,
    reviews: 215,
    stock: 8,
    description: "High-performance gaming and production monitor. Features 165Hz refresh rate, 1ms response time, and 99% sRGB color gamut.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 4,
    name: "Chronos Smartwatch Series 5",
    category: "Wearables",
    price: 249,
    rating: 4.5,
    reviews: 95,
    stock: 30,
    description: "Advanced health tracking smartwatch featuring an always-on AMOLED display, built-in GPS, blood oxygen tracking, and 7-day battery life.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 5,
    name: "Aether Dual-Band Wi-Fi 6 Router",
    category: "Networking",
    price: 179,
    rating: 4.7,
    reviews: 64,
    stock: 12,
    description: "Ultra-fast networking router supporting up to 5.4 Gbps bandwidth speed, 6 concurrent streams, and advanced WPA3 security.",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 6,
    name: "Helix Wireless Gaming Mouse",
    category: "Peripherals",
    price: 89,
    rating: 4.4,
    reviews: 120,
    stock: 45,
    description: "Lightweight wireless gaming mouse weighing only 58g. Equipped with 26K DPI optical sensor and optical microswitches.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

export const MOCK_SALES_DATA = [
  { name: "Jan", Sales: 4200, Orders: 28 },
  { name: "Feb", Sales: 5800, Orders: 35 },
  { name: "Mar", Sales: 8100, Orders: 54 },
  { name: "Apr", Sales: 7200, Orders: 46 },
  { name: "May", Sales: 9800, Orders: 62 },
  { name: "Jun", Sales: 12500, Orders: 85 }
];

export const MOCK_CATEGORY_DATA = [
  { name: "Audio", value: 3500 },
  { name: "Peripherals", value: 4200 },
  { name: "Displays", value: 6800 },
  { name: "Wearables", value: 2900 },
  { name: "Networking", value: 2100 }
];

export const MOCK_NOTIFICATIONS = [
  { id: 1, type: "system", message: "Deployment update: Frontend pod v1.2.4 successfully rolled out.", time: "5 mins ago", read: false },
  { id: 2, type: "order", message: "New Order #1042 received from Alice Johnson ($389.00)", time: "25 mins ago", read: false },
  { id: 3, type: "alert", message: "Warning: Kubernetes HPA triggered. Scaling replicas to 4 due to elevated traffic.", time: "1 hour ago", read: true }
];
