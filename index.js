const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const whiteList = ['http://localhost:8080'];
const options = {
    origin: (origin, callback) => {
        if (whiteList.includes(origin) || true) {
                   // Err, permitido?
            callback(null, true);
        } else {
            callback(new Error("No permitido"));
        }
    }
}
app.use(cors(options));

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