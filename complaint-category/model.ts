import { Schema, model } from 'mongoose';
import { categoryCollection } from '../configs/configs';

const categorySchema = new Schema({
    name: String,
    description: String
})

export default model(categoryCollection, categorySchema);