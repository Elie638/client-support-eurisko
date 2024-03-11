import { getCategories } from "./service";
import CustomError from "../configs/errors";

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