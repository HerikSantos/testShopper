import { CustomerRepository } from "../../../repository/CustomerRepository";
import { MeasureRepository } from "../../../repository/MeasureRepository";
import { Base64Validator } from "../../adapter/base64Validator/base64Validator";
import { UploadUseCase } from "./UploadUseCase";

const base64Validator = new Base64Validator();
const meeasureRepository = new MeasureRepository();
const customerRepository = new CustomerRepository();

const uploadUseCase = new UploadUseCase(
    base64Validator,
    meeasureRepository,
    customerRepository,
);

export { uploadUseCase };
