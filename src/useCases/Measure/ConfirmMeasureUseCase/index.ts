import { MeasureRepository } from "../../../repository/MeasureRepository";
import { ConfirmMeasureUseCase } from "./ConfirmMeasureUseCase";

const measureRepository = new MeasureRepository();
const confirmMeasureUseCase = new ConfirmMeasureUseCase(measureRepository);

export { confirmMeasureUseCase };
