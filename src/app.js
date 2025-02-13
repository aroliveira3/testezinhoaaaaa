const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(bodyParser.json());

app.use('/api/users', userRoutes);

app.use(errorHandler);

module.exports = app;