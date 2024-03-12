import { addCategory, deleteCategory, getCategories, updateCategory } from "./service";
import CustomError, { actionNotPerimitted, categoryIdMissing } from "../configs/errors";
import { parseToken, verifyToken } from "../middleware/is-auth";
import Joi from "joi";

const categorySchema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(5).required()
})

export const getCategoriesController = async (req: any, res: any) => {
    try {
        const categories = await getCategories();
        res.status(200).json({message: "Categories fetched", categories})
    } catch (error) {
        if(error instanceof CustomError) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
            statusCode: error.statusCode || 500
        });
        } else res.status(500).json(error);
    }
}

export const addCategoryController = async (req: any, res: any) => {
    try {
        const token = parseToken(req);
        const auth = verifyToken(token);
        if(!auth.isAdmin) {
            const error = new CustomError(actionNotPerimitted.message, actionNotPerimitted.code);
            throw error;
        }
        const request = {
            name: req.body.name,
            description: req.body.description
        }
        const { error: validationError } = categorySchema.validate(request);
        if (validationError) {
            const errorMessage = validationError.details[0].message;
            const error = new CustomError(errorMessage, 400);
            throw error;
        }
        const result = await addCategory(request);
        res.status(201).json({message: "Added Category", result})
    } catch (error) {
        if(error instanceof CustomError) {
            res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        } else res.status(500).json(error);
    }
}

export const deleteCategoryController = async (req: any, res: any) => {
    try {
        const token = parseToken(req);
        const auth = verifyToken(token);
        if(!auth.isAdmin) {
            const error = new CustomError(actionNotPerimitted.message, actionNotPerimitted.code);
            throw error;
        }
        await deleteCategory(req.body.categoryId);
        res.status(200).json({message: "Deleted Category"});
    } catch (error) {
        if(error instanceof CustomError) {
            res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        } else res.status(500).json(error);
    }
}

export const updateCategoryController = async (req: any, res: any) => {
    try {
        const token = parseToken(req);
        const auth = verifyToken(token);
        if(!auth.isAdmin) {
            const error = new CustomError(actionNotPerimitted.message, actionNotPerimitted.code);
            throw error;
        }
        const categoryId = req.body.categoryId;
        if(!categoryId) {
            const error = new CustomError(categoryIdMissing.message, categoryIdMissing.code);
            throw error;
        }
        const updatedCategory = {
            name: req.body.name,
            description: req.body.description
        }
        const { error: validationError } = categorySchema.validate(updatedCategory);
        if (validationError) {
            const errorMessage = validationError.details[0].message;
            const error = new CustomError(errorMessage, 400);
            throw error;
        }
        const result = await updateCategory({categoryId, updatedCategory});
        res.status(201).json({message: "Updated Category", result})
    } catch (error) {
        if(error instanceof CustomError) {
            res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        } else res.status(500).json(error);
    }
}