import { Router } from "express";

import { addCategoryController, deleteCategoryController, getCategoriesController, updateCategoryController } from "./controller";

const router = Router();

router.get('/list', getCategoriesController);
router.post('/add', addCategoryController);
router.delete('/delete', deleteCategoryController);
router.put('/update', updateCategoryController)

export default router;