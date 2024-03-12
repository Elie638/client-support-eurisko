import jwt from 'jsonwebtoken';
import { jwtsecret } from '../configs/configs';
import CustomError, { jwtInvalid } from '../configs/errors';

interface DecodedToken {
    userId: string;
    isAdmin: boolean;
}

const verify = (req: string) => {
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

export default verify;