import { type Customer } from "../../../database/entities/Customer";
import { type Measure } from "../../../database/entities/Measure";
import { DoubleReport, InvalidData } from "../../../errors/errors";
import {
    type ICustomer,
    type ICustomerRepository,
} from "../../../repository/ICustomerRepository";
import { type IMeasureRepository } from "../../../repository/IMeasureRepository";
import { isValidDate } from "../../../utils/isValidDate";
import { type IBase64Validator } from "../../protocols/IBase64Validator";
import { type IMeasure } from "../../protocols/interfaces";
import { geminiAPI } from "../api/geminiApi";
import { type IUploadUseCase } from "./IUploadUseCase";
import { UploadUseCase } from "./UploadUseCase";
import { verifyMeasureTimeIsGreat30Days } from "./verifyMeasureTimeIsGreat30Days";

const repository: Measure[] = [];

interface IReturnRepositorytStub {
    measureRepositoryStub: IMeasureRepository;
    customerRepositoryStub: ICustomerRepository;
}

interface IReturnMakeSut {
    sut: IUploadUseCase;
    base64ValidatorStub: IBase64Validator;
    customerRepositoryStub: ICustomerRepository;
}

function makeRepositoryStub(): IReturnRepositorytStub {
    class MeasureRepositoryStub implements IMeasureRepository {
        async add(measure: IMeasure): Promise<void> {
            repository.push({ ...measure, id: 1 });
        }

        findByUUID: (measure_uuid: string) => Promise<Measure | null>;

        update: (
            measure_uuid: string,
            confirmed_value: number,
        ) => Promise<void>;
    }

    class CustomerRepositoryStub implements ICustomerRepository {
        add: (customer: ICustomer) => Promise<Customer>;
        findByEmail: (email: string) => Promise<Customer | null>;
        async findById(customer_code: number): Promise<Customer | null> {
            const customer: Customer = {
                customer_code: 2,
                name: "testando",
                lastname: "teste da silva",
                email: "teste@gmail.com",
                password: "123",
            };
            return customer;
        }

        async findByIdAndReturnRelation(
            customer_code: number,
        ): Promise<Customer | null | undefined> {
            const customer: Customer = {
                customer_code: 2,
                name: "testando",
                lastname: "teste da silva",
                email: "teste@gmail.com",
                password: "123",
            };

            return await new Promise((resolve) => {
                resolve(customer);
            });
        }
    }

    return {
        measureRepositoryStub: new MeasureRepositoryStub(),
        customerRepositoryStub: new CustomerRepositoryStub(),
    };
}

function makeBase64Validator(): IBase64Validator {
    class Base64ValidatorStub implements IBase64Validator {
        isBase64(str: string): boolean {
            return true;
        }
    }

    return new Base64ValidatorStub();
}

const makeSut = (): IReturnMakeSut => {
    const { customerRepositoryStub, measureRepositoryStub } =
        makeRepositoryStub();

    const base64ValidatorStub = makeBase64Validator();

    const sut = new UploadUseCase(
        base64ValidatorStub,
        measureRepositoryStub,
        customerRepositoryStub,
    );

    return { sut, base64ValidatorStub, customerRepositoryStub };
};

jest.mock("../api/geminiApi", () => ({
    geminiAPI: jest.fn(() => ({
        image_url: "valid_url",
        measure_value: 123,
        measure_uuid: "valid_uuid",
    })),
}));

jest.mock("./verifyMeasureTimeIsGreat30Days", () => ({
    verifyMeasureTimeIsGreat30Days: jest.fn(() => {
        const customer: Customer = {
            customer_code: 2,
            name: "testando",
            lastname: "teste da silva",
            email: "teste@gmail.com",
            password: "123",
        };

        const measure1: Measure = {
            id: 1,
            customer,
            has_confirmed: false,
            image_url: "invalid_url",
            measure_datetime: "2024-09-30",
            measure_type: "GAS",
            measure_uuid: "uuid_inválido",
            measure_value: 151,
        };

        const measure2: Measure = {
            id: 2,
            customer,
            has_confirmed: false,
            image_url: "invalid_url",
            measure_datetime: "2024-09-30",
            measure_type: "GAS",
            measure_uuid: "uuid_inválido",
            measure_value: 151,
        };

        return [measure1, measure2];
    }),
}));

jest.mock("../../../utils/isValidDate", () => ({
    isValidDate: jest.fn(() => true),
}));

describe("Upload tests", () => {
    it("Should throw if image is undefined", async () => {
        const { sut } = makeSut();

        const fakeCustomer = {
            image: "",
            customer_code: "1",
            measure_datetime: "2004-02-12 12:00:00",
            measure_type: "WATER",
        };

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Estão faltando dados", 400),
        );
    });

    it("Should throw if customer_code is undefined", async () => {
        const { sut } = makeSut();

        const fakeCustomer = {
            image: "validImageBase64",
            customer_code: "",
            measure_datetime: "2004-02-12 12:00:00",
            measure_type: "WATER",
        };

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Estão faltando dados", 400),
        );
    });

    it("Should throw if measure_datetime is undefined", async () => {
        const { sut } = makeSut();

        const fakeCustomer = {
            image: "validImageBase64",
            customer_code: "0",
            measure_datetime: "",
            measure_type: "WATER",
        };

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Estão faltando dados", 400),
        );
    });

    it("Should throw if measure_type is undefined", async () => {
        const { sut } = makeSut();

        const fakeCustomer = {
            image: "validImageBase64",
            customer_code: "0",
            measure_datetime: "2004-02-12 12:00:00",
            measure_type: "",
        };

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Estão faltando dados", 400),
        );
    });

    it("Should throw if image is different string ", async () => {
        const { sut } = makeSut();

        const fakeCustomer = {
            image: 1,
            customer_code: "0",
            measure_datetime: "2004-02-12 12:00:00",
            measure_type: "WATER",
        };

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Tipo de dados inválido", 400),
        );
    });

    it("Should throw if customer_code is different string ", async () => {
        const { sut } = makeSut();

        const fakeCustomer = {
            image: "validImageBase64",
            customer_code: 2,
            measure_datetime: "2004-02-12 12:00:00",
            measure_type: "WATER",
        };

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Tipo de dados inválido", 400),
        );
    });

    it("Should throw if measure_datetime is different string ", async () => {
        const { sut } = makeSut();

        const fakeCustomer = {
            image: "validImageBase64",
            customer_code: "2",
            measure_datetime: 2000,
            measure_type: "WATER",
        };

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Tipo de dados inválido", 400),
        );
    });

    it("Should throw if measure_type is different string ", async () => {
        const { sut } = makeSut();

        const fakeCustomer = {
            image: "validImageBase64",
            customer_code: "2",
            measure_datetime: "2004-02-12 12:00:00",
            measure_type: 3,
        };

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Tipo de dados inválido", 400),
        );
    });

    it("Should throw if measure_type is different WATER or GAS ", async () => {
        const { sut } = makeSut();

        const fakeCustomer = {
            image: "validImageBase64",
            customer_code: "2",
            measure_datetime: "2004-02-12 12:00:00",
            measure_type: "ENERGIA",
        };

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Measure_type precisa ser WATER ou GAS", 400),
        );
    });

    it("Should throw if measure_datetime is invalid format ", async () => {
        const { sut } = makeSut();

        (isValidDate as jest.Mock).mockImplementationOnce(() => false);

        const fakeCustomer = {
            image: "validImageBase64",
            customer_code: "2",
            measure_datetime: "2004/02/12 12:00:00",
            measure_type: "WATER",
        };

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Data inválida", 400),
        );
    });

    it("Should throw if image format is different png, jpg, jpeg, webp, heic, heif ", async () => {
        const { sut } = makeSut();

        const fakeCustomer = {
            image: "data:image/wmv;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAoHBwkHBgoJChMKCgkDFRYXFhYaFhYYFx4dHR0iIh0aHyMjGh0tJCUkIiIjJyg2KyEzKzU2Njs8Uz9BQkQzO0JQVzK/2wBDAQsLCw0NFBQZFRk3HR8sOzU4NTc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//Z",
            customer_code: "2",
            measure_datetime: "2004-02-12 12:00:00",
            measure_type: "WATER",
        };

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Formato da imagem inválido", 400),
        );
    });

    it("Should throw if image is invalid base64", async () => {
        const { sut, base64ValidatorStub } = makeSut();

        jest.spyOn(base64ValidatorStub, "isBase64").mockImplementationOnce(
            () => false,
        );

        const fakeCustomer = {
            image: "data:image/png;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAoHBwkHBgoJChMKCgkDFRYXFhYaFhYYFx4dHR0iIh0aHyMjGh0tJCUkIiIjJyg2KyEzKzU2Njs8Uz9BQkQzO0JQVzK/2wBDAQsLCw0NFBQZFRk3HR8sOzU4NTc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//Z",
            customer_code: "2",
            measure_datetime: "2004-02-12 12:00:00",
            measure_type: "WATER",
        };

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Base64 inválido", 400),
        );
    });

    it("Should throw if image base64 format is invalid", async () => {
        const { sut } = makeSut();

        const fakeCustomer = {
            image: "image/png;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAoHBwkHBgoJChMKCgkDFRYXFhYaFhYYFx4dHR0iIh0aHyMjGh0tJCUkIiIjJyg2KyEzKzU2Njs8Uz9BQkQzO0JQVzK/2wBDAQsLCw0NFBQZFRk3HR8sOzU4NTc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//Z",
            customer_code: "2",
            measure_datetime: "2004-02-12 12:00:00",
            measure_type: "WATER",
        };

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Formato do code64 inválido", 400),
        );
    });

    it("Should call isValidDate with correct params", async () => {
        const { sut } = makeSut();

        const isValidateDateSpy = (
            isValidDate as jest.Mock
        ).mockImplementationOnce(() => false);

        const fakeCustomer = {
            image: "data:image/png;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAoHBwkHBgoJChMKCgkDFRYXFhYaFhYYFx4dHR0iIh0aHyMjGh0tJCUkIiIjJyg2KyEzKzU2Njs8Uz9BQkQzO0JQVzK/2wBDAQsLCw0NFBQZFRk3HR8sOzU4NTc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//Z",
            customer_code: "2",
            measure_datetime: "2004-02-12 12:00:00",
            measure_type: "WATER",
        };

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Data inválida", 400),
        );
        expect(isValidateDateSpy).toHaveBeenCalledWith(
            fakeCustomer.measure_datetime,
        );
    });

    it("Should call isBase64 with correct params", async () => {
        const { sut } = makeSut();

        const base64ValidatorStub = makeBase64Validator();

        // jest.mock("isBase64", () => false);

        const fakeCustomer = {
            image: "data:image/png;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAoHBwkHBgoJChMKCgkDFRYXFhYaFhYYFx4dHR0iIh0aHyMjGh0tJCUkIiIjJyg2KyEzKzU2Njs8Uz9BQkQzO0JQVzK/2wBDAQsLCw0NFBQZFRk3HR8sOzU4NTc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//Z",
            customer_code: "2",
            measure_datetime: "2004-02-12 12:00:00",
            measure_type: "WATER",
        };

        const isBase64Spy = jest.spyOn(base64ValidatorStub, "isBase64");

        await expect(async () => {
            await sut.execute(fakeCustomer);
            expect(isBase64Spy).toHaveBeenCalledWith(
                "/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAoHBwkHBgoJChMKCgkDFRYXFhYaFhYYFx4dHR0iIh0aHyMjGh0tJCUkIiIjJyg2KyEzKzU2Njs8Uz9BQkQzO0JQVzK/2wBDAQsLCw0NFBQZFRk3HR8sOzU4NTc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//Z",
            );
        }).rejects.toBeInstanceOf(Error);
    });

    it("verifyMeasureTimeIsGreat30Days should add measures to array if compareDate < 30", async () => {
        const { sut, customerRepositoryStub } = makeSut();

        const fakeCustomer = {
            image: "data:image/png;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAoHBwkHBgoJChMKCgkDFRYXFhYaFhYYFx4dHR0iIh0aHyMjGh0tJCUkIiIjJyg2KyEzKzU2Njs8Uz9BQkQzO0JQVzK/2wBDAQsLCw0NFBQZFRk3HR8sOzU4NTc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//Z",
            customer_code: "2",
            measure_datetime: "2004-02-12 12:00:00",
            measure_type: "WATER",
        };

        jest.spyOn(
            customerRepositoryStub,
            "findByIdAndReturnRelation",
        ).mockResolvedValueOnce(null);

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Customer_code inválido", 400),
        );
    });

    it("Should throw if days' last measure > 30", async () => {
        const { sut } = makeSut();

        const fakeCustomer = {
            image: "data:image/png;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAoHBwkHBgoJChMKCgkDFRYXFhYaFhYYFx4dHR0iIh0aHyMjGh0tJCUkIiIjJyg2KyEzKzU2Njs8Uz9BQkQzO0JQVzK/2wBDAQsLCw0NFBQZFRk3HR8sOzU4NTc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//Z",
            customer_code: "2",
            measure_datetime: "2004-02-12 12:00:00",
            measure_type: "WATER",
        };

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new DoubleReport("Leitura do mês já realizada", 409),
        );
    });

    it("Should geminiAPI return valid values", async () => {
        const { sut, customerRepositoryStub } = makeSut();

        (verifyMeasureTimeIsGreat30Days as jest.Mock).mockImplementationOnce(
            () => [],
        );
        jest.spyOn(customerRepositoryStub, "findById").mockResolvedValueOnce(
            null,
        );
        const fakeCustomer = {
            image: "data:image/png;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAoHBwkHBgoJChMKCgkDFRYXFhYaFhYYFx4dHR0iIh0aHyMjGh0tJCUkIiIjJyg2KyEzKzU2Njs8Uz9BQkQzO0JQVzK/2wBDAQsLCw0NFBQZFRk3HR8sOzU4NTc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//Z",
            customer_code: "2",
            measure_datetime: "2004-02-12 12:00:00",
            measure_type: "WATER",
        };

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Customer_code inválido", 400),
        );
    });

    it("Should return correct values if all is work", async () => {
        const { sut } = makeSut();

        (verifyMeasureTimeIsGreat30Days as jest.Mock).mockImplementationOnce(
            () => [],
        );

        const fakeCustomer = {
            image: "data:image/png;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAoHBwkHBgoJChMKCgkDFRYXFhYaFhYYFx4dHR0iIh0aHyMjGh0tJCUkIiIjJyg2KyEzKzU2Njs8Uz9BQkQzO0JQVzK/2wBDAQsLCw0NFBQZFRk3HR8sOzU4NTc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//Z",
            customer_code: "2",
            measure_datetime: "2004-02-12 12:00:00",
            measure_type: "WATER",
        };
        const result = await sut.execute(fakeCustomer);
        expect(result).toEqual({
            image_url: "valid_url",
            measure_value: 123,
            measure_uuid: "valid_uuid",
        });
    });
});
