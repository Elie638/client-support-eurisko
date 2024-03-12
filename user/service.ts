import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import crypto from 'crypto';

import User from './model';
import CustomError, { invalidCredentials, emailRegistered, tokenExpired, invalidToken, invalidEmail, wrongPassword } from '../configs/errors';
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
    req.password = await bcrypt.hash(req.password, 12);
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

export const resetPasswordRequest = async (req: string) => {
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

export const verifyResetToken = async (req: string) => {
    const user = await User.findOne({resetToken: req});
    if(!user) {
        const error = new CustomError(invalidToken.message, invalidToken.code);
        throw error;
    }
    if(user.resetExpiration < Date.now()) {
        const error = new CustomError(tokenExpired.message, tokenExpired.code);
        throw error;
    }
    const userId = user?._id;
    
    return userId;
}

export const resetPassword = async (req: any) => {
    const pass = req.password;
    const token = req.token;
    const userId = await verifyResetToken(token);
    if(!userId) {
        const error = new CustomError(tokenExpired.message, tokenExpired.code);
        throw error;
    }
    const hashedPass = await bcrypt.hash(pass, 12);
    await User.updateOne(
        { _id: userId },
        {
            $unset: { resetToken: 1, resetExpiration: 1 },
            $set: { password: hashedPass }
        }
    );    
}

export const resendToken = async (req: string) => {
    const user = await User.findOne({email: req});
    if(!user) {
        const error = new CustomError(invalidEmail.message, invalidEmail.code);
        throw error;
    }
    const token =  user.resetToken;
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

export const changePassword = async (req: any) => {
    const oldPass = req.oldPassword;
    const newPass = req.newPassword;
    const userId = req.userId;
    const existingUser = await User.findById(userId).select('password');
    if(!(await bcrypt.compare(oldPass, existingUser!.password))) {
        const error = new CustomError(wrongPassword.message, wrongPassword.code);
        throw error;
    }
    const hashedPass = await bcrypt.hash(newPass, 12);
    await User.findByIdAndUpdate(userId, {password: hashedPass})
}