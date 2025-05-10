import prisma from '../database/prisma.js'
import { UploadStatus } from '@prisma/client'
import { format as formatCNPJ } from '@fnando/cnpj'
import { addJobToQueue } from '../../worker/queue.js'

async function statusArquivo(req, res) {
  const { id } = req.params;

  try {
    const arquivo = await prisma.uploadedFile.findUnique({
      where: { id },
      select: {
        status: true,
        errorMessage: true,
      },
    });

    if (!arquivo) {
      return res.status(404).json({ error: 'Arquivo não encontrado.' });
    }

    return res.status(200).json({
      status: arquivo.status,
      errorMessage: JSON.parse(arquivo.errorMessage) || null,
    });
  } catch (error) {
    console.error('Erro ao buscar status do arquivo:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar status do arquivo.' });
  }
}

async function uploadArquivo(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo não enviado.' });
    }

    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        filename: req.file.originalname,
        status: UploadStatus.PENDING,
      },
    });

    const base64Buffer = req.file.buffer.toString('base64');

    await addJobToQueue({
      uploadId: uploadedFile.id,
      buffer: base64Buffer,
    });

    return res.status(202).json({
      message: 'Arquivo enviado com sucesso para processamento.',
      id: uploadedFile.id,
    });
  } catch (error) {
    console.error('Erro no upload:', error.message);
    return res.status(500).json({ error: 'Erro interno ao processar o upload.' });
  }
}

async function listarContratos(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  try {
    const [contratos, total] = await Promise.all([
      prisma.contrato.findMany({
        skip,
        take: limit,
        orderBy: { businessName: 'asc' },
        select: {
          cnpj: true,
          businessName: true,
          additionalData: true,
        },
      }),
      prisma.contrato.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    if (!check_page_param(page, totalPages, res)) {
      return;
    }

    const formatados = contratos.map((contrato) => ({
      ...contrato,
      cnpj: contrato.cnpj ? formatCNPJ(contrato.cnpj) : null,
    }));

    res.status(200).json({
      data: formatados,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Erro ao listar contratos:', error);
    res.status(500).json({ error: 'Erro ao buscar contratos.' });
  }
}

function check_page_param(page, totalPages, res) {
  if (page > totalPages && totalPages !== 0) {
    res.status(400).json({
      error: `Página ${page} não disponível. Total de páginas: ${totalPages}.`,
    });
    return false;
  }
  return true;
}

export {
  uploadArquivo,
  listarContratos,
  statusArquivo
};
