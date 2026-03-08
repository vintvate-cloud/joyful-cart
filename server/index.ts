import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'joyful_cart_secret';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware
const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

const authorizeRoles = (roles: string[]) => {
    return (req: any, res: any, next: any) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};

app.use(cors({
    origin: (origin, callback) => {
        // Allow any localhost origin during development
        if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// --- AUTH ROUTES ---

// Register
app.post('/api/auth/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name }
        });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});

// --- USER ORDER ROUTES ---

// Create new order
app.post('/api/orders', authenticateToken, async (req: any, res) => {
    const { total, items } = req.body; // items: [{ productId, quantity, price }]
    try {
        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                total: parseFloat(total),
                status: 'PENDING',
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        quantity: parseInt(item.quantity),
                        price: parseFloat(item.price)
                    }))
                }
            },
            include: { items: true }
        });
        res.status(201).json(order);
    } catch (error) {
        console.error('Order Creation Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's orders
app.get('/api/orders', authenticateToken, async (req: any, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.id },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User Profile
app.get('/api/auth/me', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// --- PRODUCT ROUTES ---

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: { category: true }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id },
            include: { category: true }
        });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --- CATEGORY ROUTES ---
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --- ADMIN PRODUCT ACTIONS ---

// Create product
app.post('/api/products', authenticateToken, authorizeRoles(['ADMIN']), async (req, res) => {
    const { title, description, price, originalPrice, image, categoryId, brand, ageGroup, stock, isFeatured } = req.body;
    try {
        const product = await prisma.product.create({
            data: {
                title, description, price: parseFloat(price), originalPrice: originalPrice ? parseFloat(originalPrice) : null,
                image, categoryId, brand, ageGroup, stock: parseInt(stock) || 0, isFeatured: !!isFeatured
            }
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update product
app.put('/api/products/:id', authenticateToken, authorizeRoles(['ADMIN']), async (req, res) => {
    const { title, description, price, originalPrice, image, categoryId, brand, ageGroup, stock, isFeatured } = req.body;
    try {
        const product = await prisma.product.update({
            where: { id: req.params.id },
            data: {
                title, description, price: parseFloat(price), originalPrice: originalPrice ? parseFloat(originalPrice) : null,
                image, categoryId, brand, ageGroup, stock: parseInt(stock) || 0, isFeatured: !!isFeatured
            }
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete product
app.delete('/api/products/:id', authenticateToken, authorizeRoles(['ADMIN']), async (req, res) => {
    try {
        await prisma.product.delete({ where: { id: req.params.id } });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --- CLOUDINARY UPLOAD ROUTE ---
app.post('/api/upload', authenticateToken, authorizeRoles(['ADMIN']), upload.single('image'), async (req: any, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Convert buffer to data URI for Cloudinary
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
            resource_type: 'auto',
            folder: 'joyful-cart-products'
        });

        res.json({ url: result.secure_url });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Upload failed' });
    }
});

// --- ADMIN ORDER ACTIONS ---

// Get all orders
app.get('/api/admin/orders', authenticateToken, authorizeRoles(['ADMIN']), async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { user: true, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status
app.put('/api/admin/orders/:id', authenticateToken, authorizeRoles(['ADMIN']), async (req, res) => {
    const { status } = req.body;
    try {
        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: { status },
            include: { user: true, items: { include: { product: true } } }
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --- ADMIN CUSTOMER ACTIONS ---

// Get all users
app.get('/api/admin/users', authenticateToken, authorizeRoles(['ADMIN']), async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { _count: { select: { orders: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --- STATS & ANALYTICS ---

app.get('/api/admin/stats', authenticateToken, authorizeRoles(['ADMIN']), async (req, res) => {
    try {
        const [totalUsers, totalProducts, totalOrders, totalRevenue, recentOrders] = await Promise.all([
            prisma.user.count(),
            prisma.product.count(),
            prisma.order.count(),
            prisma.order.aggregate({ _sum: { total: true } }),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true } } }
            })
        ]);

        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenue._sum.total || 0,
            recentOrders,
            revenueChange: "+12.5%", // These could be calculated by comparing with last month
            ordersChange: "+8.2%",
            productsChange: `+${totalProducts > 5 ? '5' : totalProducts}`,
            customersChange: "+15.3%"
        });
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/admin/analytics', authenticateToken, authorizeRoles(['ADMIN']), async (req, res) => {
    try {
        // Simple monthly revenue for the last 6 months (mocked with logic)
        const orders = await prisma.order.findMany({
            where: { createdAt: { gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } },
            select: { total: true, createdAt: true }
        });

        const revenueByMonth = orders.reduce((acc: any, order) => {
            const month = order.createdAt.toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + order.total;
            return acc;
        }, {});

        const chartData = Object.keys(revenueByMonth).map(month => ({
            name: month,
            revenue: revenueByMonth[month]
        }));

        res.json({
            revenueChart: chartData,
            categoryDistribution: [
                { name: 'Toys', value: 400 },
                { name: 'Clothes', value: 300 },
                { name: 'Books', value: 300 },
                { name: 'Electronics', value: 200 },
            ]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
