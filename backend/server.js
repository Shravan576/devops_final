const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Successfully connected to MongoDB.');
    seedInitialProducts();
})
.catch(err => {
    console.error('Error connecting to MongoDB database:', err.message);
});

// --- MONGO SCHEMAS & MODELS ---

const ProductSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: String,
    category: String,
    price: Number,
    rating: Number,
    reviews: Number,
    stock: Number,
    description: String,
    image: String
});

const OrderSchema = new mongoose.Schema({
    id: String,
    date: String,
    items: Array,
    total: Number,
    status: String,
    step: Number,
    shippingDetails: Object
});

const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

// --- SEED DATABASE IF EMPTY ---
async function seedInitialProducts() {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            console.log('No products found in DB. Seeding initial e-commerce catalog...');
            const seedData = [
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
            await Product.insertMany(seedData);
            console.log('Seeded database successfully with 6 initial products.');
        }
    } catch (err) {
        console.error('Error seeding data:', err.message);
    }
}

// --- REST API ENDPOINTS ---

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date()
    });
});

// Products: Read catalog
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ id: 1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Products: Add new item
app.post('/api/products', async (req, res) => {
    try {
        const count = await Product.countDocuments();
        const maxIdProd = await Product.findOne().sort({ id: -1 });
        const nextId = maxIdProd ? maxIdProd.id + 1 : 1;

        const newProd = new Product({
            id: nextId,
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            rating: 5.0,
            reviews: 0,
            stock: req.body.stock,
            description: req.body.description || 'No description provided.',
            image: req.body.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
        });
        
        await newProd.save();
        res.status(201).json(newProd);
    } catch (err) {
        res.status(455).json({ error: err.message });
    }
});

// Products: Delete item
app.delete('/api/products/:id', async (req, res) => {
    try {
        const idToDelete = parseInt(req.params.id);
        const result = await Product.findOneAndDelete({ id: idToDelete });
        if (!result) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: `Successfully deleted product ID ${idToDelete}`, product: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Orders: Read logs
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Orders: Create new order
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order({
            id: req.body.id || ("ORD-" + Math.floor(1000 + Math.random() * 9000)),
            date: req.body.date || new Date().toISOString().split('T')[0],
            items: req.body.items,
            total: req.body.total,
            status: "Order Placed",
            step: 1,
            shippingDetails: req.body.shippingDetails
        });

        // Deduct stocks in MongoDB
        for (const item of newOrder.items) {
            await Product.findOneAndUpdate(
                { id: item.id },
                { $inc: { stock: -item.quantity } }
            );
        }

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mock Auth endpoint
app.post('/api/auth/login', (req, res) => {
    const { username, role } = req.body;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    // Return standard token metadata
    res.json({
        username,
        role: role || 'user',
        token: `mock-jwt-token-for-${username}`
    });
});

app.listen(PORT, () => {
    console.log(`Express API Server listening on port ${PORT}`);
});
