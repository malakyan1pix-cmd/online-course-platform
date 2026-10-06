const express = require('express');

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use('/api', routes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Route not found'
    });
});

app.use(errorHandler);

module.exports = app;