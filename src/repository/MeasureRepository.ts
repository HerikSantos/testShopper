import { type Repository } from "typeorm";

import { appDataSource } from "../database";
import { Measure } from "../database/entities/Measure";
import { MeasuresNotFound } from "../errors/errors";
import { type IMeasure } from "../useCases/protocols/interfaces";
import { type IMeasureRepository } from "./IMeasureRepository";

class MeasureRepository implements IMeasureRepository {
    private readonly repository: Repository<Measure>;

    constructor() {
        this.repository = appDataSource.getRepository(Measure);
    }

    async add(measure: IMeasure): Promise<void> {
        const newMeasure = this.repository.create([
            {
                measure_value: measure.measure_value,
                measure_uuid: measure.measure_uuid,
                measure_datetime: measure.measure_datetime,
                measure_type: measure.measure_type,
                has_confirmed: measure.has_confirmed,
                image_url: measure.image_url,
                customer: measure.customer,
            },
        ]);
        await this.repository.save(newMeasure);
    }

    async findByUUID(measure_uuid: string): Promise<Measure | null> {
        return await this.repository.findOneBy({ measure_uuid });
    }

    async update(measure_uuid: string, confirmed_value: number): Promise<void> {
        const measure = await this.repository.findOneBy({ measure_uuid });

        if (!measure) {
            throw new MeasuresNotFound("Leitura do mês já realizado", 404);
        }

        Object.assign(measure, {
            has_confirmed: true,
            measure_value: confirmed_value,
        });

        await this.repository.save(measure);
    }
}

export { MeasureRepository };
