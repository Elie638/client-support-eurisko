import User from './model';
import CustomError, { emailRegistered } from '../configs/errors';


interface signUpReq {
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    isAdmin: Boolean,
    isVip: Boolean
}

export const signUp = async (req: any): Promise<any> => {
    if(await User.findOne({email: req.email})) {
        const error = new CustomError(emailRegistered.message, emailRegistered.code);
        throw error;
    }
    const user = new User(req);
    await user.save();
    return user;
}

