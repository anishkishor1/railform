require('dotenv').config();
const express = require('express');
const cors = require('cors');
const appRoutes = require('./routes/appRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', appRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Railway Concession & Pass Application Backend API is active.' });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
