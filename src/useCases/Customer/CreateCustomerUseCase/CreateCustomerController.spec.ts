import { type Response, type Request } from "express";

import { type IDbCustomer } from "../../protocols/interfaces";
import { CreateCustomerController } from "./CreateCustomerController";
import { type ICreateCustomerUseCase } from "./ICreateCustomerUseCase";

function makeCreateCustomerUsecase(): ICreateCustomerUseCase {
    class CreateCustomerUseCaseStub implements ICreateCustomerUseCase {
        async execute(data: any): Promise<IDbCustomer> {
            const fakeCustomer = {
                customer_code: 1,
            } as IDbCustomer;

            return fakeCustomer;
        }
    }

    return new CreateCustomerUseCaseStub();
}

interface ITypeSut {
    createCustomerUseCaseStub: ICreateCustomerUseCase;
    sut: CreateCustomerController;
}

function makeSut(): ITypeSut {
    const createCustomerUseCaseStub = makeCreateCustomerUsecase();
    const sut = new CreateCustomerController(createCustomerUseCaseStub);
    return {
        sut,
        createCustomerUseCaseStub,
    };
}

describe("CreateCustomerController", () => {
    it("should return 201 status code and customer data on success", async () => {
        const { sut } = makeSut();
        const body = {
            name: "valid_name",
            lastname: "valid_lastName",
            email: "valid_email",
            password: "valid_password",
            passwordConfirmation: "valid_password",
        };

        const mockRequest = {} as Request;
        mockRequest.body = body;

        const mockResponse = {} as Response;
        mockResponse.status = jest.fn().mockReturnThis();
        mockResponse.json = jest.fn().mockReturnThis();

        await sut.handle(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            customer_code: "1",
        });
    });

    it("should call createCustomerUseCase.execute with correct data", async () => {
        const { sut, createCustomerUseCaseStub } = makeSut();
        const body = {
            name: "valid_name",
            lastname: "valid_lastName",
            email: "valid_email",
            password: "valid_password",
            passwordConfirmation: "valid_password",
        };

        const mockRequest = {} as Request;
        mockRequest.body = body;

        const mockResponse = {} as Response;
        mockResponse.status = jest.fn().mockReturnThis();
        mockResponse.json = jest.fn().mockReturnThis();

        jest.spyOn(createCustomerUseCaseStub, "execute");

        await sut.handle(mockRequest, mockResponse);

        expect(createCustomerUseCaseStub.execute).toHaveBeenCalledWith(body);
    });

    it("should handle errors correctly", async () => {
        const { sut, createCustomerUseCaseStub } = makeSut();
        const body = {
            name: "valid_name",
            lastname: "valid_lastName",
            email: "valid_email",
            password: "valid_password",
            passwordConfirmation: "valid_password",
        };

        const mockRequest = {} as Request;
        mockRequest.body = body;

        const mockResponse = {} as Response;
        mockResponse.status = jest.fn().mockReturnThis();
        mockResponse.json = jest.fn().mockReturnThis();

        jest.spyOn(createCustomerUseCaseStub, "execute").mockRejectedValue(
            new Error(),
        );

        await expect(sut.handle(mockRequest, mockResponse)).rejects.toThrow();
    });
});
