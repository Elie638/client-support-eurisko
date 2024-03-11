import CustomError from "../configs/errors";
import { signUp, signIn } from "./service";
import Joi from "joi";
import bcrypt from "bcryptjs";

const signUpSchema = Joi.object({
    email: Joi.string().email().trim().required(),
    firstName: Joi.string().trim().min(1).required(),
    lastName: Joi.string().trim().min(1).required(),
    password: Joi.string().min(8).required(),
    isAdmin: Joi.boolean().required(),
    isVip: Joi.boolean().optional()
});

export const signUpController = async (req: any, res: any) => {
    let body = req.body;
    const { error: validationError } = signUpSchema.validate(body);
    body.password = await bcrypt.hash(req.body.password, 12);

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