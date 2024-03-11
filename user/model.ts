import { Schema, model } from 'mongoose';
import { userCollection } from '../configs/configs';

interface userInterface {
    _id: any,
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    isAdmin: boolean;
    isVIP: boolean;
    resetToken: string;
    resetExpiration: any;
}

const userSchema = new Schema<userInterface>({
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    isVIP: {
        type: Boolean,
        default: false,
    },
    isAdmin: Boolean,
    resetToken: String,
    resetExpiration: Date
})

export default model(userCollection, userSchema);