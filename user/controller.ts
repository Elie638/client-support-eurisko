import CustomError, { invalidConfirmPassword } from "../configs/errors";
import { signUp, signIn, resetPasswordRequest, verifyResetToken, resetPassword, resendToken } from "./service";
import Joi from "joi";

const signUpSchema = Joi.object({
    email: Joi.string().email().trim().required(),
    firstName: Joi.string().trim().min(1).required(),
    lastName: Joi.string().trim().min(1).required(),
    password: Joi.string().min(8).required(),
    isAdmin: Joi.boolean().required(),
    isVip: Joi.boolean().optional()
});

const passSchema = Joi.string().min(8).required();

export const signUpController = async (req: any, res: any) => {
    let body = req.body;
    const { error: validationError } = signUpSchema.validate(body);

    if (validationError) {
        const errorMessage = validationError.details[0].message;
        const error = new CustomError(errorMessage, 400);
        return res.status(error.statusCode).json({
            message: error.message,
            statusCode: error.statusCode,
        });
    }
    try {
        const user = await signUp(body);
        res.status(200).json({message: "Successfully added user", body});
    } catch (error) {
        if(error instanceof CustomError) {
            res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        } else res.status(500).json(error);
    }
}

export const signInController = async (req: any, res: any) => {
    let body = req.body;
    try {
        const response = await signIn(body);
        res.status(200).json({message: "Successfully logged in", response});
    } catch (error) {
        if(error instanceof CustomError) {
            res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        } else res.status(500).json(error);
    }
}

export const resetPasswordRequestController = async (req: any, res: any) => {
    let email = req.body.email;
    try {
        await resetPasswordRequest(email);
        res.status(200).json({message: "Email sent"});
    } catch (error) {
        if(error instanceof CustomError) {
            res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        } else res.status(500).json(error);
    }
}

export const verifyResetTokenController = async (req: any, res: any) => {
    const token = req.params.token;
    try {
        await verifyResetToken(token);
        res.status(200).json({message: "Token Verified"}, token);
    } catch (error) {
        if(error instanceof CustomError) {
            res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        } else res.status(500).json(error);
    }
}

export const resetPasswordController = async (req: any, res: any) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const token = req.body.token
    const { error: validationError } = passSchema.validate(password);
    if (validationError) {
        const errorMessage = validationError.details[0].message;
        const error = new CustomError(errorMessage, 400);
        return res.status(error.statusCode).json({
            message: error.message,
            statusCode: error.statusCode,
        });
    }
    if (password !== confirmPassword) {
        const error = new CustomError(invalidConfirmPassword.message, invalidConfirmPassword.code);
        return res.status(error.statusCode).json({
            message: error.message,
            statusCode: error.statusCode,
        });
    }
    try {
        await resetPassword({password, token});
        res.status(200).json({message: "Password Updated"});
    } catch (error) {
        if(error instanceof CustomError) {
            res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        } else res.status(500).json(error);
    }
}

export const resendTokenController = async (req: any, res: any) => {
    const email = req.email;
    try {
        await resendToken(email);
        res.status(200).json({message: "Token Resent"});
    } catch (error) {
        if(error instanceof CustomError) {
            res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        } else res.status(500).json(error);
    }
} 