import { Router } from "express";

import { deleteComplaintController, filterSearchComplaintsController, getComplaintDetailsController, getUserComplaintsController, postComplaintController } from "./controller";

const router = Router();

router.post('/post', postComplaintController);
router.get('/list', getUserComplaintsController);
router.get('/item', getComplaintDetailsController);
router.delete('/delete', deleteComplaintController);
router.get('/item-filter', filterSearchComplaintsController);

export default router;