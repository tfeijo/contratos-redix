const express = require('express');
const routes = require('./routes');
const logger = require('./middlewares/logger');
const autenticarToken = require('./middlewares/authenticate');

const app = express();

app.use(express.json());
app.use(logger);
app.use(autenticarToken);
app.use(routes);

module.exports = app;
