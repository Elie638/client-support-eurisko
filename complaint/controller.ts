import CustomError, { actionNotPerimitted, tokenMissing } from "../configs/errors";
import verify from "../middleware/is-auth";
import { getUserComplaints, postComplaint } from "./service";
import Joi from "joi";

const complaintSchema = Joi.object({
    title: Joi.string().min(5).required(),
    body: Joi.string().required(),
    categories: Joi.array().items(Joi.string()).optional(),//min(1).required(),
    userId: Joi.string().required(),
});
const paginationSchema = Joi.object({
    userId: Joi.string().required(),
    page: Joi.number().integer().greater(0).required(),
    itemPerPage: Joi.number().integer().greater(0).required()
});

export const postComplaintController = async (req: any, res: any) => {
    try {
        const token = req.get('Authorization').split(' ')[1];
        if (!token) {
            const error = new CustomError(tokenMissing.message, tokenMissing.code);
            throw error;
        }
        const auth = verify(token);
        if(auth.isAdmin) {
            const error = new CustomError(actionNotPerimitted.message, actionNotPerimitted.code);
            throw error;
        }
        const title = req.body.title;
        const body = req.body.body;
        const categories = req.body.categories;
        const userId = auth.userId;
        const complaint = {
            title,
            body,
            categories,
            userId
        }
        const { error: validationError } = complaintSchema.validate(complaint);

        if (validationError) {
            const errorMessage = validationError.details[0].message;
            const error = new CustomError(errorMessage, 400);
            return res.status(error.statusCode).json({
                message: error.message,
                statusCode: error.statusCode,
            });
        }
        const resultComplaint = await postComplaint(complaint);
        res.status(201).json({message: "Posted User Complaint", resultComplaint});
    } catch (error) {
        if(error instanceof CustomError) {
            res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        } else res.status(500).json(error);
    }
}

export const getUserComplaintsController = async (req: any, res: any) => {
    try {
        const token = req.get('Authorization').split(' ')[1];
        if (!token) {
            const error = new CustomError(tokenMissing.message, tokenMissing.code);
            throw error;
        }
        const auth = verify(token);
        if(auth.isAdmin) {
            const error = new CustomError(actionNotPerimitted.message, actionNotPerimitted.code);
            throw error;
        }
        const request = {
            userId: auth.userId,
            page: req.query.page,
            itemPerPage: req.query.itemPerPage
        }
        const { error: validationError } = paginationSchema.validate(request);

        if (validationError) {
            const errorMessage = validationError.details[0].message;
            const error = new CustomError(errorMessage, 400);
            return res.status(error.statusCode).json({
                message: error.message,
                statusCode: error.statusCode,
            });
        }
        const result = await getUserComplaints(request);
        res.status(200).json({message: "Fetched User Complaints", result});
    } catch (error) {
        if(error instanceof CustomError) {
            res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        } else res.status(500).json(error);
    }
}