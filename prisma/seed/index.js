const contratoSeed = require('./contratos.seed');

async function runAllSeeds(prisma) {
  await contratoSeed(prisma);
  console.log('Seeding concluído com sucesso!');
}

module.exports = runAllSeeds;
