import Category from './model';

export const getCategories = async () => {
    const categories = await Category.find();
    return categories;
}