const express = require('express');

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy'
    });
});

app.get('/products', (req, res) => {
    res.json([
        {
            id: 1,
            name: 'Producto de prueba',
            price: 100
        }
    ]);
});

app.listen(port, () => {
    console.log(`📦 Product Service running on port ${port}`);
});