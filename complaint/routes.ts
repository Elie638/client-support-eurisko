import { Router } from "express";

import { deleteComplaintController, filterSearchComplaintsController, getComplaintDetailsController, getUserComplaintsController, postComplaintController, updateStatusController } from "./controller";

const router = Router();

router.post('/post', postComplaintController);
router.get('/list', getUserComplaintsController);
router.get('/item', getComplaintDetailsController);
router.delete('/delete', deleteComplaintController);
router.get('/item-filter', filterSearchComplaintsController);
router.put('/update-status', updateStatusController);

export default router;