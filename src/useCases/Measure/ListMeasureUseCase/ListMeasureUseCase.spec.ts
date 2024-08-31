import { listMeasureUseCase } from ".";
import { type Customer } from "../../../database/entities/Customer";
import { type Measure } from "../../../database/entities/Measure";
import {
    InvalidData,
    InvalidType,
    MeasuresNotFound,
} from "../../../errors/errors";
import { type ICustomerRepository } from "../../../repository/ICustomerRepository";
import { type IMeasureRepository } from "../../../repository/IMeasureRepository";
import { type ICustomer, type IMeasure } from "../../protocols/interfaces";
import { type IListMeasureUseCase } from "./IListMeasureUseCase";
import { ListMeasureUseCase } from "./ListMeasureUseCase";

const repository: Measure[] = [];

interface IReturnMakeSut {
    sut: IListMeasureUseCase;
    customerRepositoryStub: ICustomerRepository;
}

interface IReturnRepositorytStub {
    measureRepositoryStub: IMeasureRepository;
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
                measures: [],
            };

            return await new Promise((resolve) => {
                resolve(customer);
            });
        }
    }
    const customerRepositoryStub = new CustomerRepositoryStub();
    const measureRepositoryStub = new MeasureRepositoryStub();

    return { measureRepositoryStub, customerRepositoryStub };
}

function makeSut(): IReturnMakeSut {
    const { customerRepositoryStub } = makeRepositoryStub();

    const sut = new ListMeasureUseCase(customerRepositoryStub);

    return { sut, customerRepositoryStub };
}

describe("Listmeasure test", () => {
    it("Should throw customer_code different string", async () => {
        const { sut } = makeSut();

        const customer_code = 2;

        await expect(sut.execute(customer_code)).rejects.toEqual(
            new InvalidData("Tipo invállido costumer_code", 400),
        );
    });

    it("Should throw queryString different string", async () => {
        const { sut } = makeSut();

        const customer_code = "2";
        const queryString = 3;

        await expect(sut.execute(customer_code, queryString)).rejects.toEqual(
            new InvalidData("Filtro measure_type não é válido", 400),
        );
    });

    it("Should throw queryString different WATER or GAS", async () => {
        const { sut } = makeSut();

        const customer_code = "2";
        const queryString = "any";
        const queryString2 = "water";

        await expect(sut.execute(customer_code, queryString)).rejects.toEqual(
            new InvalidType("Tipo de medição não permitida", 400),
        );

        await expect(sut.execute(customer_code, queryString2)).rejects.toEqual(
            new InvalidType("Tipo de medição não permitida", 400),
        );
    });

    it("Should throw inválid customer_code ", async () => {
        const { sut, customerRepositoryStub } = makeSut();

        const customer_code = "2";
        const queryString2 = "WATER";

        jest.spyOn(
            customerRepositoryStub,
            "findByIdAndReturnRelation",
        ).mockResolvedValueOnce(null);

        await expect(sut.execute(customer_code, queryString2)).rejects.toEqual(
            new InvalidData("Costumer_code inválido", 400),
        );
    });

    it("Should throw costumer don't has anyone measure", async () => {
        const { sut } = makeSut();

        const customer_code = "2";
        const queryString2 = "WATER";

        await expect(sut.execute(customer_code, queryString2)).rejects.toEqual(
            new MeasuresNotFound("Nenhuma leitura encontrada", 404),
        );
    });

    it("Should throw costumer don't has anyone measure", async () => {
        const { sut, customerRepositoryStub } = makeSut();
        const customer_code = "2";
        const queryString2 = "WATER";

        jest.spyOn(
            customerRepositoryStub,
            "findByIdAndReturnRelation",
        ).mockResolvedValueOnce({
            customer_code: 2,
            name: "testando",
            lastname: "teste da silva",
            email: "teste@gmail.com",
            password: "123",
        });

        const result = await sut.execute(customer_code, queryString2);

        expect(result).toEqual({
            customer_code: "2",
            name: "testando",
            lastname: "teste da silva",
            email: "teste@gmail.com",
            password: "123",
        });
    });
});
