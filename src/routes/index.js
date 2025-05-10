import express from 'express'
import contratoRoutes from './contratos.routes.js'

const router = express.Router();

router.use('/', contratoRoutes);

export default router;
