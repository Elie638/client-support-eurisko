import { Router } from "express";

import { signUpController } from "./controller";

const router = Router();

router.post('/signup', signUpController);

export default router;