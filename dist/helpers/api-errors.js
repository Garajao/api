"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.ApiError = ApiError;
class BadRequestError extends ApiError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends ApiError {
    constructor(message) {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends ApiError {
    constructor(message) {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends ApiError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
