const { UploadStatus } = require('@prisma/client');

module.exports = async function (prisma) {
  const upload = await prisma.uploadedFile.create({
    data: {
      filename: 'seed.xlsx',
      status: UploadStatus.SUCCESS,
    },
  });

  await prisma.contrato.createMany({
    data: [
      {
        cnpj: '45678912000122',
        businessName: 'empresa.alpha@email.com',
        additionalData: 'Empresa Alpha Ltda.',
        arquivoId: upload.id,
      },
      {
        cnpj: '032165487000133',
        businessName: 'negocios.beta@email.com',
        additionalData: 'Negócios Beta ME',
        arquivoId: upload.id,
      },
    ],
  });

  console.log('✅ Seed de contratos executado com sucesso!');
};
