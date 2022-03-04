const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());

require('./middleware/auth');

// Middleware JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.send("BIENVENIDO A WOOKS");
})

app.use('/books', require('./routes/router'));
app.use('/users', require('./routes/users.router'));

app.listen(process.env.PORT || 3005, () => {
    console.log(`SERVIDOR CORRIENDO EN EL PUERTO: ${process.env.PORT || 3005}`);
})