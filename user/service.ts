import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import crypto from 'crypto';

import User from './model';
import CustomError, { invalidCredentials, emailRegistered } from '../configs/errors';
import { emailApi, jwtsecret } from '../configs/configs';

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: emailApi
    }
}));

const userByEmail = async (email: string) => {
    const user = await User.findOne({email: email});
    return user;
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

export const resetPassword = async (req: string) => {
    const token = await new Promise<string>((resolve, reject) => {
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer.toString('hex'));
            }
        });
    });
    const user = await userByEmail(req);
    if(!user) return;
    user.resetToken = token,
    user.resetExpiration = Date.now() + 3600000;
    await user.save();
    transporter.sendMail({
        to: req,
        from: 'testemail9323@gmail.com',
        subject: 'Password reset',
        html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:8080/reset/${token}">link</a> to set a new password</p>
        `
    });
}