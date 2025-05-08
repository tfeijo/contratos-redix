function handlePrismaError(error, context = 'processar') {
  let status = 500;
  let message = `Erro interno ao ${context}.`;

  switch (error?.code) {
    case 'P2025':
      status = 404;
      message = 'Contrato não encontrado.';
      break;
    default:
      console.error(`[PrismaError] (${context})`, error);
      break;
  }

  return { status, message };
}

module.exports = handlePrismaError;
