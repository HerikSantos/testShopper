import { type Customer } from "../../../database/entities/Customer";
import { type Measure } from "../../../database/entities/Measure";
import {
    ConfirmationDuplicate,
    InvalidData,
    MeasuresNotFound,
} from "../../../errors/errors";
import { type IMeasureRepository } from "../../../repository/IMeasureRepository";
import { type IMeasure } from "../../protocols/interfaces";
import { ConfirmMeasureUseCase } from "./ConfirmMeasureUseCase";
import { type IConfirmMeasureUseCase } from "./IConfirmMeasureUseCase";

const repository: Measure[] = [];

interface IReturnMakeSut {
    sut: IConfirmMeasureUseCase;
    measureRepositoryStub: IMeasureRepository;
}

interface IReturnRepositorytStub {
    measureRepositoryStub: IMeasureRepository;
}

function makeRepositoryStub(): IReturnRepositorytStub {
    class MeasureRepositoryStub implements IMeasureRepository {
        async add(measure: IMeasure): Promise<void> {
            repository.push({ ...measure, id: 1 });
        }

        async findByUUID(measure_uuid: string): Promise<Measure | null> {
            const customer: Customer = {
                customer_code: 2,
                name: "testando",
                lastname: "teste da silva",
                email: "teste@gmail.com",
                password: "123",
            };

            const measure: Measure = {
                customer,
                has_confirmed: true,
                id: 1,
                image_url: "valid_url",
                measure_datetime: "2023-02-02 11:11:11",
                measure_type: "WATER",
                measure_uuid: "VALID_UUID",
                measure_value: 131,
            };

            return await new Promise((resolve) => {
                resolve(measure);
            });
        }

        update: (
            measure_uuid: string,
            confirmed_value: number,
        ) => Promise<void>;
    }
    const measureRepositoryStub = new MeasureRepositoryStub();
    return { measureRepositoryStub };
}

function makeSut(): IReturnMakeSut {
    const { measureRepositoryStub } = makeRepositoryStub();

    const sut = new ConfirmMeasureUseCase(measureRepositoryStub);

    return { sut, measureRepositoryStub };
}

describe("Listmeasure test", () => {
    it("Should throw if missing data", async () => {
        const { sut } = makeSut();

        const data = {
            measure_uuid: "",
            confirmed_value: 123,
        };

        await expect(sut.execute(data)).rejects.toEqual(
            new InvalidData("Estão faltando dados", 400),
        );
    });

    it("Should throw if measured_uuid diffrent string", async () => {
        const { sut } = makeSut();

        const data = {
            measure_uuid: 3,
            confirmed_value: 123,
        };

        await expect(sut.execute(data)).rejects.toEqual(
            new InvalidData("Tipo dos dados inválido", 400),
        );
    });

    it("Should throw if confirmed_value diffrent number", async () => {
        const { sut } = makeSut();

        const data = {
            measure_uuid: "valid_uuid",
            confirmed_value: "invalid_confirmed_value",
        };

        await expect(sut.execute(data)).rejects.toEqual(
            new InvalidData("Tipo dos dados inválido", 400),
        );
    });

    it("Should throw if invalid confirmed_uuid", async () => {
        const { sut, measureRepositoryStub } = makeSut();

        const data = {
            measure_uuid: "valid_uuid",
            confirmed_value: 123,
        };

        jest.spyOn(measureRepositoryStub, "findByUUID").mockResolvedValueOnce(
            null,
        );

        await expect(sut.execute(data)).rejects.toEqual(
            new MeasuresNotFound("Leitura não encontrada", 404),
        );
    });

    it("Should throw if measure was confirmed", async () => {
        const { sut } = makeSut();

        const data = {
            measure_uuid: "valid_uuid",
            confirmed_value: 123,
        };

        await expect(sut.execute(data)).rejects.toEqual(
            new ConfirmationDuplicate("Leitura do mês já confirmada", 409),
        );
    });
});
