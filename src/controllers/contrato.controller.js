const prisma = require('../database/prisma');
const handlePrismaError = require('../utils/handlePrismaError');
const { format: formatCNPJ } = require('@fnando/cnpj');

async function criarContrato(req, res) {
  try {
    return res.status(201).json({});
  } catch (error) {
    const { status, message } = handlePrismaError(error, 'Criar contrato');
    return res.status(status).json({ error: message });
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
        orderBy: { business_name: 'asc' },
        select: {
          cnpj: true,
          business_name: true,
          additional_data: true,
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

module.exports = {
  criarContrato,
  listarContratos,
};
