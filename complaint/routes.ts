import { Router } from "express";

import { getUserComplaintsController, postComplaintController } from "./controller";

const router = Router();

router.post('/post', postComplaintController);
router.get('/list', getUserComplaintsController);

export default router;