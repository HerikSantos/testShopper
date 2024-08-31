import { type Request, type Response } from "express";

import { type IController } from "../../protocols/IController";
import { type ICreateCustomerUseCase } from "./ICreateCustomerUseCase";

class CreateCustomerController implements IController {
    private readonly createCustomerUseCase: ICreateCustomerUseCase;
    constructor(createCustomerUseCase: ICreateCustomerUseCase) {
        this.createCustomerUseCase = createCustomerUseCase;
    }

    async handle(request: Request, response: Response): Promise<Response> {
        const data = request.body;

        const customer = await this.createCustomerUseCase.execute(data);

        return response.status(201).json(
            Object.assign({}, customer, {
                customer_code: `${customer.customer_code}`,
            }),
        );
    }
}

export { CreateCustomerController };
