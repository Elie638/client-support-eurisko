import CustomError, { categoryNotFound, sameNameCategory } from '../configs/errors';
import Category from './model';

export const getCategories = async () => {
    const categories = await Category.find().select('name');
    return categories;
}

export const addCategory = async (req: any) => {
    if(await Category.findOne({name: req.name})) {
        const error = new CustomError(sameNameCategory.message, sameNameCategory.code);
        throw error;
    }
    const category = new Category(req);
    await category.save();
    return category;
}

export const deleteCategory = async (req: any) => {
    const result = await Category.findByIdAndDelete(req);
    if(!result) {
        const error = new CustomError(categoryNotFound.message, categoryNotFound.code);
        throw error;
    }
}

export const updateCategory = async (req: any) => {
    const categoryId = req.categoryId;
    const updatedCategory = req.updatedCategory;
    const result = await Category.findByIdAndUpdate(categoryId, updatedCategory, {new: true});
    return result;
}

export const getCategoriesPaginated = async (req: any) => {
    const page = req.page;
    const itemPerPage = req.itemPerPage;
    const totalItems = await Category.find().countDocuments();
    const categories = await Category.find()
        .skip((page-1) * itemPerPage)
        .limit(itemPerPage)
        .select('name');
    return({totalItems, categories});
}

export const getCategoryDetails = async (req: string) => {
    const complaint = await Category.findById(req);
    return complaint;
}