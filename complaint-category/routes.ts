import { Router } from "express";

import { getCategoriesController } from "./controller";

const router = Router();

router.get('/list', getCategoriesController);

export default router;