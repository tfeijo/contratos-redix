import express from 'express'
import routes from './routes/index.js'
import logger from './middlewares/logger.js'
import autenticarToken from './middlewares/authenticate.js'

const app = express();

app.use(express.json());
app.use(logger);
app.use(autenticarToken);
app.use(routes);

export default app;
