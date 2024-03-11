import { Schema, model } from 'mongoose';
import { userCollection } from '../configs/configs';

const userSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    isVIP: {
        type: Boolean,
        default: false,
    },
    isAdmin: Boolean
})

export default model(userCollection, userSchema);