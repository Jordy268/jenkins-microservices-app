const express = require('express');
const axios = require('axios');
const CircuitBreaker = require('opossum');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de circuit breakers
const userServiceBreaker = new CircuitBreaker(
    async (req) => {
        const response = await axios({
            method: req.method,
            url: `http://user-service:3001${req.originalUrl}`,
            data: req.body,
            headers: req.headers
        });

        return response.data;
    },
    {
        timeout: 3000,
        errorThresholdPercentage: 50,
        resetTimeout: 10000
    }
);


const productServiceBreaker = new CircuitBreaker(
    async (req) => {
        const response = await axios({
            method: req.method,
            url: `http://product-service:3002${req.originalUrl}`,
            data: req.body,
            headers: req.headers
        });

        return response.data;
    },
    {
        timeout: 3000,
        errorThresholdPercentage: 50,
        resetTimeout: 10000
    }
);


// Middleware
app.use(express.json());


// Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});


// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        services: {
            userService: userServiceBreaker.status.stats,
            productService: productServiceBreaker.status.stats
        }
    });
});


// ===============================
// USER SERVICE
// ===============================
app.use('/users', async (req, res) => {
    try {

        const result = await userServiceBreaker.fire(req);

        res.json(result);

    } catch (error) {

        console.error("User Service Error:", error.message);

        res.status(503).json({
            error: 'Service Unavailable',
            message: 'User service is currently unavailable'
        });

    }
});


// ===============================
// PRODUCT SERVICE
// ===============================
app.use('/products', async (req, res) => {
    try {

        const result = await productServiceBreaker.fire(req);

        res.json(result);

    } catch (error) {

        console.error("Product Service Error:", error.message);

        res.status(503).json({
            error: 'Service Unavailable',
            message: 'Product service is currently unavailable'
        });

    }
});


// Métricas
app.get('/metrics', (req, res) => {

    res.json({
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        circuitBreakers: {
            userService: userServiceBreaker.status,
            productService: productServiceBreaker.status
        }
    });

});


// Inicio del servidor
app.listen(port, () => {
    console.log(`🚀 API Gateway running on port ${port}`);
});