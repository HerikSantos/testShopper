import { Router } from "express";

import { confirmMeasureUseCase } from "../useCases/Measure/ConfirmMeasureUseCase";
import { ConfirmedMeasureController } from "../useCases/Measure/ConfirmMeasureUseCase/ConfirmMeasureController";
import { listMeasureUseCase } from "../useCases/Measure/ListMeasureUseCase";
import { ListMeasureController } from "../useCases/Measure/ListMeasureUseCase/ListMeasureController";
import { uploadUseCase } from "../useCases/Measure/UploadMeasureUseCase";
import { UploadController } from "../useCases/Measure/UploadMeasureUseCase/UploadController";

const measureRoute = Router();

const uploadController = new UploadController(uploadUseCase);
const listMeasureController = new ListMeasureController(listMeasureUseCase);
const confirmedMeasureController = new ConfirmedMeasureController(
    confirmMeasureUseCase,
);

measureRoute.post("/upload", async (request, response) => {
    await uploadController.handle(request, response);
});

measureRoute.get("/:customer_code/list", async (request, response) => {
    await listMeasureController.handle(request, response);
});

measureRoute.patch("/confirm", async (request, response) => {
    await confirmedMeasureController.handle(request, response);
});

export { measureRoute };
