import cors from 'cors';
import express from 'express';
import * as routes from './routes/index.js';
import { connectDB } from './mongoose.js';
import { logger } from './lib/middleware/logger.js';

const app = express();
const port = process.env.PORT || 8787;

app.use(cors());
app.use(logger);

routes.register(app);

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.info(`Running on port ${port}`);
  });
};

startServer();
