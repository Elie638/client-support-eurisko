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

export default class CustomError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  }