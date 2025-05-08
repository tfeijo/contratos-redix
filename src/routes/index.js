const express = require('express');
const contratoRoutes = require('./contratos.routes');

const router = express.Router();

router.use('/contratos', contratoRoutes);

module.exports = router;
