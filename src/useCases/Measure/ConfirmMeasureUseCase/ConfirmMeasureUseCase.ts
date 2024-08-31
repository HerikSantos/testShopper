import {
    ConfirmationDuplicate,
    InvalidData,
    MeasuresNotFound,
} from "../../../errors/errors";
import { type IMeasureRepository } from "../../../repository/IMeasureRepository";
import { type IConfirmMeasureUseCase } from "./IConfirmMeasureUseCase";

class ConfirmMeasureUseCase implements IConfirmMeasureUseCase {
    private readonly measureRepository: IMeasureRepository;

    constructor(measureRepository: IMeasureRepository) {
        this.measureRepository = measureRepository;
    }

    async execute(data: any): Promise<void> {
        const { measure_uuid, confirmed_value } = data;

        if (!measure_uuid || !confirmed_value) {
            throw new InvalidData("Estão faltando dados", 400);
        }

        if (
            typeof measure_uuid !== "string" ||
            typeof confirmed_value !== "number"
        ) {
            throw new InvalidData("Tipo dos dados inválido", 400);
        }

        const measure = await this.measureRepository.findByUUID(measure_uuid);

        if (!measure) {
            throw new MeasuresNotFound("Leitura não encontrada", 404);
        }

        if (measure.has_confirmed) {
            throw new ConfirmationDuplicate(
                "Leitura do mês já confirmada",
                409,
            );
        }

        await this.measureRepository.update(measure_uuid, confirmed_value);
    }
}

export { ConfirmMeasureUseCase };
