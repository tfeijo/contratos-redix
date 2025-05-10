import { Worker } from 'bullmq';
import connection from './utils/connectionRedis.js';
import processFile from './processor/processorFile.js';

console.log('Worker iniciado...');
console.log('Tentando conectar ao Redis...');

const worker = new Worker(
  'file-processing',
  async (job) => {
    console.log(`Job recebido:`, job.id, job.name, job.data);

    try {
      await processFile(job.data);
      console.log(`Job ${job.id} processado com sucesso`);
    } catch (err) {
      console.error(`Erro ao processar job ${job.id}:`, err.message);
      throw err;
    }
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} finalizado`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} falhou:`, err.message);
});
