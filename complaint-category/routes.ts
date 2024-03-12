import { Router } from "express";

import { addCategoryController, deleteCategoryController, getCategoriesController, getCategoriesPaginatedController, getCategoryDetailsController, updateCategoryController } from "./controller";

const router = Router();

router.get('/list', getCategoriesController);
router.post('/add', addCategoryController);
router.delete('/delete', deleteCategoryController);
router.put('/update', updateCategoryController);
router.get('/paginated-list', getCategoriesPaginatedController);
router.get('/item', getCategoryDetailsController);

export default router;