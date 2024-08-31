import { type Request, type Response } from "express";

import { type IController } from "../../protocols/IController";
import { type IUploadUseCase } from "./IUploadUseCase";

class UploadController implements IController {
    private readonly uploadUseCase: IUploadUseCase;
    constructor(uploadUseCase: IUploadUseCase) {
        this.uploadUseCase = uploadUseCase;
    }

    async handle(request: Request, response: Response): Promise<Response> {
        const data = request.body;

        const result = await this.uploadUseCase.execute(data);

        return response.status(201).json(result);
    }
}

export { UploadController };
