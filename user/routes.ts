import { Router } from "express";

import { changePasswordController, resendTokenController, resetPasswordController, resetPasswordRequestController, signInController, signUpController, verifyResetTokenController } from "./controller";

const router = Router();

router.post('/signup', signUpController);
router.post('/signin', signInController);
router.post('/reset', resetPasswordRequestController);
router.get('/reset/:token', verifyResetTokenController);
router.put('/reset', resetPasswordController);
router.post('resend-token', resendTokenController);
router.put('/change-password', changePasswordController);

export default router;