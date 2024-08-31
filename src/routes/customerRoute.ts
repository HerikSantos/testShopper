import { Router } from "express";

import { createCustomerUseCase } from "../useCases/Customer/CreateCustomerUseCase";
import { CreateCustomerController } from "../useCases/Customer/CreateCustomerUseCase/CreateCustomerController";

const createCustomerController = new CreateCustomerController(
    createCustomerUseCase,
);

const customerRoute = Router();

customerRoute.post(
    "/customer",
    async (request, response) =>
        await createCustomerController.handle(request, response),
);

export { customerRoute };
