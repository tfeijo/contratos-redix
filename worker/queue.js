import { Queue } from 'bullmq'
import connection from './utils/connectionRedis.js'

const fileQueue = new Queue('file-processing', { connection });

const addJobToQueue = async (jobData) => {
  await fileQueue.add('process-file', jobData);
  console.log('Adding job to queue:', jobData);
};

export { fileQueue, addJobToQueue };
