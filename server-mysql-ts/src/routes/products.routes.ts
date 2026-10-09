import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller';

const router = Router();

router.get('/getAll', ProductsController.getAll);
router.get('/getById/:id', ProductsController.getById);
router.post('/create', ProductsController.create);
router.put('/update/:id', ProductsController.update);
router.delete('/delete/:id', ProductsController.delete);
router.patch('/change-price/:id', ProductsController.changePrice);

export default router;