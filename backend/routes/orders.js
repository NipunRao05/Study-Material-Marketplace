import express from 'express';
import { checkout, getOrders, getSellingOrders } from '../controllers/orderController.js';

const router = express.Router();

router.post('/checkout', checkout);
router.get('/:userId', getOrders);
router.get('/selling/:userId', getSellingOrders);

export default router;
