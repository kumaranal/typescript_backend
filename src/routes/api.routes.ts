import express from 'express';
import { createfn,findfn,deletefn,updatefn ,findSelectivefn, checkfullfillment, checkLowest, bulkUpdatefn} from '../controllers/product.controller';
const router = express.Router();


router.post('/product', createfn);
router.get('/product', findfn);
router.get('/product/:productUniqueCode',findSelectivefn)
router.delete('/product/:productUniqueCode',deletefn)
router.put('/product/:productUniqueCode',updatefn)
router.put('/product',bulkUpdatefn)
router.post('/checkfullfillment',checkfullfillment)
router.post('/checkLowest',checkLowest)





export default router;