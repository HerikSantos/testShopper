import { GoogleGenerativeAIError } from "@google/generative-ai";
import { type NextFunction, type Request, type Response } from "express";

import {
    InvalidData,
    InvalidType,
    MeasuresNotFound,
    DoubleReport,
    ConfirmationDuplicate,
} from "../errors/errors";

function errorPrevent(
    err: Error,
    request: Request,
    response: Response,
    next: NextFunction,
): Response | undefined {
    console.log(err);

    if (err instanceof InvalidData) {
        return response.status(err.statusCode).json({
            error_code: "INVALID_DATA",
            error_description: err.message,
        });
    }

    if (err instanceof InvalidType) {
        return response.status(err.statusCode).json({
            error_code: "INVALID_TYPE",
            error_description: err.message,
        });
    }

    if (err instanceof GoogleGenerativeAIError) {
        return response.status(500).json({
            error_description: "Internal Server Error",
        });
    }

    if (err instanceof MeasuresNotFound) {
        return response.status(err.statusCode).json({
            error_code: "MEASURES_NOT_FOUND",
            error_description: err.message,
        });
    }

    if (err instanceof DoubleReport) {
        return response.status(err.statusCode).json({
            error_code: "DOUBLE_REPORT",
            error_description: err.message,
        });
    }

    if (err instanceof ConfirmationDuplicate) {
        return response.status(err.statusCode).json({
            error_code: "CONFIRMATION_DUPLICATE",
            error_description: err.message,
        });
    }

    return response.status(500).json({
        error_description: "Internal Server Error",
    });
}

export { errorPrevent };
