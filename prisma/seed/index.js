import contratoSeed from './contratos.seed';

async function runAllSeeds(prisma) {
  await contratoSeed(prisma);
  console.log('Seeding concluído com sucesso!');
}

export default runAllSeeds;
