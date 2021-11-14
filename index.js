const express = require('express');
const app = express();
require('dotenv').config();

const Router = require('./routes/router');

// Middleware JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.send("BIENVENIDO A WOOKS");
})

app.use('/books', Router);

app.listen(process.env.PORT || 3005, () => {
    console.log(`SERVIDOR CORRIENDO EN EL PUERTO: ${process.env.PORT || 3005}`);
})