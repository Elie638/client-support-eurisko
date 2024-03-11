interface error {
    message: string,
    code: number
}

export const emailRegistered: error = {
    message: "There is an account that is already registered with this email",
    code: 409
}

export const invalidCredentials: error = {
    message: "Your username or password does not match",
    code: 401
}

export default class CustomError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  }