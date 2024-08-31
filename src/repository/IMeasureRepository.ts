import { type Measure } from "../database/entities/Measure";
import { type IMeasure } from "../useCases/protocols/interfaces";

interface IMeasureRepository {
    add: (measure: IMeasure) => Promise<void>;
    findByUUID: (measure_uuid: string) => Promise<Measure | null>;
    update: (measure_uuid: string, confirmed_value: number) => Promise<void>;
}

export type { IMeasureRepository };
