import { type Request, type Response } from "express";

import { type IListMeasureUseCase } from "./IListMeasureUseCase";

class ListMeasureController {
    private readonly listMeasureUseCase: IListMeasureUseCase;
    constructor(listMeasureUseCase: IListMeasureUseCase) {
        this.listMeasureUseCase = listMeasureUseCase;
    }

    async handle(request: Request, response: Response): Promise<Response> {
        const { customer_code } = request.params;
        const { measure_type } = request.query;

        console.log(measure_type);

        const customer = await this.listMeasureUseCase.execute(
            customer_code,
            measure_type,
        );

        return response.status(200).json(customer);
    }
}

export { ListMeasureController };
