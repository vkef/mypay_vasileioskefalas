import express from 'express';
import permissionsRouter from './permissions/permissions.routes';

const app = express();

app.use(express.json());
app.use(permissionsRouter);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
