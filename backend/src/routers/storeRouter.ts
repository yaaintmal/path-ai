import { Router } from 'express';
import { purchaseItem, getInventory, getPurchases, consumeShield } from '#controllers';
import { authMiddleware } from '#middleware';

const router = Router();

router.post('/purchase', authMiddleware, purchaseItem);
router.get('/inventory', authMiddleware, getInventory);
router.get('/purchases', authMiddleware, getPurchases);
router.post('/consume-shield', authMiddleware, consumeShield);

export default router;
