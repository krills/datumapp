import express from 'express';
import eventRoutes from './internal/events.js';
const router = express.Router();

router.use('/events', eventRoutes);

export default router;
