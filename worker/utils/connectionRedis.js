import IORedis from 'ioredis';

const redis = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
});

redis.on('connect', () => {
  console.log('Conectado ao Redis com ioredis!');
});

redis.on('error', (err) => {
  console.error('Erro de conexão com Redis:', err.message);
});

export default redis;