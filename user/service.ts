import User from './model';
import CustomError, { invalidCredentials, emailRegistered } from '../configs/errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtsecret } from '../configs/configs';

interface userSchema {
    _id: any,
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    isAdmin: boolean;
    isVIP: boolean
}

const userByEmail = async (email: string) => {
    const user = await User.findOne({email: email});
    return user as userSchema | null;
};

export const signUp = async (req: any) => {
    if(await userByEmail(req.email)) {
        const error = new CustomError(emailRegistered.message, emailRegistered.code);
        throw error;
    }
    const user = new User(req);
    await user.save();
    return user;
}

export const signIn = async (req: any) => {
    const user = await userByEmail(req.email);
    if (!user || !(await bcrypt.compare(req.password, user.password))) {
        const error = new CustomError(invalidCredentials.message, invalidCredentials.code);
        throw error;
    }
    const userId = user._id
    const token = jwt.sign(
        {
            userId: userId,
            isAdmin: user.isAdmin
        },
        jwtsecret,
        { expiresIn: '1h' }
    );
    return {token, userId}
}