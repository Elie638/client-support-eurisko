interface error {
    message: string,
    code: number
}

export const emailRegistered: error = {
    message: "There is an account that is already registered with this email",
    code: 409
}

export const invalidCredentials: error = {
    message: "Your email or password does not match",
    code: 401
}

export const tokenExpired: error = {
    message: "The token has expired",
    code: 401
}

export const invalidToken: error = {
    message: "The token is invalid",
    code: 401
}

export const invalidConfirmPassword = {
    message: "The password and the confirm password do not match",
    code: 401
}

export const invalidEmail = {
    message: "Invalid Email",
    code: 401
}

export const jwtInvalid = {
    message: "Failed to authenticate token",
    code: 401
}

export const actionNotPerimitted = {
    message: "You do not have permission to execute this action",
    code: 401
}

export const tokenMissing = {
    message: "The validation token is missing",
    code: 400
}

export const wrongPassword = {
    message: "The old password you have entered doesn't match",
    code: 401
}

export const samePassword = {
    message: "The new password cannot be the same as the old one",
    code: 400
}

export const sameNameCategory = {
    message: "There exist a category with the same name",
    code: 400
}

export const categoryNotFound = {
    message: "The category was not found",
    code: 404
}

export const categoryIdMissing = {
    message: "The categoryId was not sent",
    code: 400
}

export default class CustomError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
}