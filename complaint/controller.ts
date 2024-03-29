import CustomError, { actionNotPerimitted, tokenMissing } from "../configs/errors";
import { parseToken, verifyToken } from "../middleware/is-auth";
import { deleteComplaint, filterSearchComplaints, getComplaintDetails, getUserComplaints, postComplaint, updateStatus } from "./service";
import Joi from "joi";

const complaintSchema = Joi.object({
    title: Joi.string().min(5).required(),
    body: Joi.string().required(),
    categoriesId: Joi.array().items(Joi.string()).optional(),//min(1).required(),
    userId: Joi.string().required(),
});
const paginationSchema = Joi.object({
    userId: Joi.string().required(),
    page: Joi.number().integer().greater(0).required(),
    itemPerPage: Joi.number().integer().greater(0).required()
});
const detailSchema = Joi.object({
    userId: Joi.string().required(),
    complaintId: Joi.string().required()
});
const filterSearchSchema = Joi.object({
    userId: Joi.string().optional(),
    status: Joi.string().optional().valid('PENDING', 'INPROGRESS', 'RESOLVED', 'REJECTED'),
    page: Joi.number().integer().greater(0).required(),
    itemPerPage: Joi.number().integer().greater(0).required()
});
const updateStatusSchema = Joi.object({
    status: Joi.string().required().valid('PENDING', 'INPROGRESS', 'RESOLVED', 'REJECTED'),
    complaintId: Joi.string().required()
});

export const postComplaintController = async (req: any, res: any) => {
    try {
        const token = parseToken(req);
        const auth = verifyToken(token);
        if(auth.isAdmin) {
            const error = new CustomError(actionNotPerimitted.message, actionNotPerimitted.code);
            throw error;
        }
        const complaint = {
            title: req.body.title,
            body: req.body.body,
            categoriesId: req.body.categoriesId,
            userId: auth.userId
        }
        const { error: validationError } = complaintSchema.validate(complaint);

        if (validationError) {
            const errorMessage = validationError.details[0].message;
            const error = new CustomError(errorMessage, 400);
            throw error;
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
        const token = parseToken(req);
        const auth = verifyToken(token);
        if(auth.isAdmin) {
            const error = new CustomError(actionNotPerimitted.message, actionNotPerimitted.code);
            throw error;
        }
        const request = {
            userId: auth.userId,
            page: req.query.page | 1,
            itemPerPage: req.query.itemPerPage | 2
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

export const getComplaintDetailsController = async (req: any, res: any) => {
    try {
        const token = parseToken(req);
        const auth = verifyToken(token);
        if(auth.isAdmin) {
            const error = new CustomError(actionNotPerimitted.message, actionNotPerimitted.code);
            throw error;
        }
        const request = {
            userId: auth.userId,
            complaintId: req.query.complaintId
        }
        const { error: validationError } = detailSchema.validate(request);

        if (validationError) {
            const errorMessage = validationError.details[0].message;
            const error = new CustomError(errorMessage, 400);
            throw error;
        }
        const result = await getComplaintDetails(request);
        res.status(200).json({message: "Fetched Complaint Details", result});
    } catch (error) {
        if(error instanceof CustomError) {
            res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        } else res.status(500).json(error);
    }
}

export const deleteComplaintController = async (req: any, res: any) => {
    try {
        const token = parseToken(req);
        const auth = verifyToken(token);
        if(auth.isAdmin) {
            const error = new CustomError(actionNotPerimitted.message, actionNotPerimitted.code);
            throw error;
        }
        const request = {
            userId: auth.userId,
            complaintId: req.query.complaintId
        }
        const { error: validationError } = detailSchema.validate(request);
        if (validationError) {
            const errorMessage = validationError.details[0].message;
            const error = new CustomError(errorMessage, 400);
            throw error;
        }
        await deleteComplaint(request);
        res.status(200).json({message: "Deleted Complaint"});
    } catch (error) {
        if(error instanceof CustomError) {
            res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        } else res.status(500).json(error);
    }
}

export const filterSearchComplaintsController = async (req: any, res: any) => {
    try {
        const token = parseToken(req);
        const auth = verifyToken(token);
        if(!auth.isAdmin) {
            const error = new CustomError(actionNotPerimitted.message, actionNotPerimitted.code);
            throw error;
        }
        const request = {
            page: req.query.page | 1,
            itemPerPage: req.query.itemPerPage | 2,
            userId: req.query.userId,
            status: req.query.status
        }
        const { error: validationError } = filterSearchSchema.validate(request);
        if (validationError) {
            const errorMessage = validationError.details[0].message;
            const error = new CustomError(errorMessage, 400);
            throw error;
        }
        const result = await filterSearchComplaints(request);
        res.status(200).json({message: "Results of filter search", result});
    } catch (error) {
        if(error instanceof CustomError) {
            res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        } else res.status(500).json(error);
    }
}

export const updateStatusController = async (req: any, res: any) => {
    try {
        const token = parseToken(req);
        const auth = verifyToken(token);
        if(!auth.isAdmin) {
            const error = new CustomError(actionNotPerimitted.message, actionNotPerimitted.code);
            throw error;
        }
        const request = {
            complaintId: req.body.complaintId,
            status: req.body.status
        }
        const { error: validationError } = updateStatusSchema.validate(request);
        if (validationError) {
            const errorMessage = validationError.details[0].message;
            const error = new CustomError(errorMessage, 400);
            throw error;
        }
        const result = await updateStatus(request);
        res.status(200).json({message: "Status updated", result})
    } catch (error) {
        if(error instanceof CustomError) {
            res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        } else res.status(500).json(error);
    }
}