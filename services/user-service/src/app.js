const express = require('express');

const app = express();

app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'user-service'
    });
});

// Obtener usuario por ID
app.get('/users/:id', (req, res) => {

    res.json({
        id: req.params.id,
        name: 'Usuario de prueba'
    });

});

// Crear usuario
app.post('/users', (req, res) => {

    res.status(201).json({
        message: 'Usuario creado',
        user: req.body
    });

});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`User Service ejecutándose en el puerto ${PORT}`);
});