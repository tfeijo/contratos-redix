const express = require('express');
const {
  criarContrato,
  listarContratos,
} = require('../controllers/contrato.controller');

const router = express.Router();

router.get('/', listarContratos);

module.exports = router;
