const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const apiRouter = require('./routes/api');
const connectDB = require('./schemas/index');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;
connectDB();

// middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.send("Hello. This is YT concert's server.");
});

// 404 handling
// custom middleware
app.use((req, res, next) => {
    const error = new Error("Not Found!");
    error.status = 404;
    next(error);
});

// Error handling
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

app.listen(HTTP_PORT, () => {
    console.log("Server on: " + HTTP_PORT);
});
