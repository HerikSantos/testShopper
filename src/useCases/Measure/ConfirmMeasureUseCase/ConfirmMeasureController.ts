import { type Request, type Response } from "express";

import { type IConfirmMeasureUseCase } from "./IConfirmMeasureUseCase";

class ConfirmedMeasureController {
    private readonly confirmMeasureUseCase: IConfirmMeasureUseCase;

    constructor(confirmMeasureUseCase: IConfirmMeasureUseCase) {
        this.confirmMeasureUseCase = confirmMeasureUseCase;
    }

    async handle(request: Request, response: Response): Promise<Response> {
        const data = request.body;

        await this.confirmMeasureUseCase.execute(data);

        return response.status(200).json({
            success: true,
        });
    }
}

export { ConfirmedMeasureController };
