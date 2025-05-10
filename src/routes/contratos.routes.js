import express from 'express';
import multer from 'multer';
import {
  uploadArquivo,
  listarContratos,
  statusArquivo,
} from '../controllers/contrato.controller.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/contratos/lista', listarContratos);
router.get('/upload/:id', statusArquivo);
router.post('/upload', upload.single('file'), uploadArquivo);

export default router;
