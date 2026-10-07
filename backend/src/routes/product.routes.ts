import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin';
import { getProducts, getProductById, getCategories, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';

const router = Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.post('/', requireAdmin, createProduct);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

export default router;
