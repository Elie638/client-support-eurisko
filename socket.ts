import CustomError, { ioNotInit } from "./configs/errors";

let io: any;

export const init = (httpServer: any) => {
    io = require('socket.io')(httpServer);
    return io;
}

export const getIo = () => {
    if(!io) {
        throw new CustomError(ioNotInit.message, ioNotInit.code);
    }
    return io;
}