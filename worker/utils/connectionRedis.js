import IORedis from 'ioredis';

const redis = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  reconnectOnError: (err) => {
    const targetErrors = ['ECONNRESET', 'ETIMEDOUT'];
    return targetErrors.includes(err.code);
  },
});

redis.on('connect', () => {
  console.log('✅ Conectado ao Redis com ioredis!');
});

redis.on('error', (err) => {
  console.error('❌ Erro de conexão com Redis:', err.code, err.message);
});

export default redis;
