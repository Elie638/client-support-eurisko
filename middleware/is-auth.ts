import jwt from 'jsonwebtoken';
import { jwtsecret } from '../configs/configs';
import CustomError, { jwtInvalid, tokenMissing } from '../configs/errors';

interface DecodedToken {
    userId: string;
    isAdmin: boolean;
}

export const verifyToken = (req: string) => {
    let decodedToken;
    try {
        decodedToken = jwt.verify(req, jwtsecret) as DecodedToken;
    } catch (error) {
        throw error;
    }
    if (!decodedToken) {
        const error = new CustomError(jwtInvalid.message, jwtInvalid.code);
        throw error;
    }
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;
    return {userId, isAdmin}
}

export const parseToken = (req: any) => {
    const token = req.get('Authorization').split(' ')[1];
    if (!token) {
        const error = new CustomError(tokenMissing.message, tokenMissing.code);
        throw error;
    }
    return token;
}