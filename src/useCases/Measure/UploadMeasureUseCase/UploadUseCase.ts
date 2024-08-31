import { type Measure } from "../../../database/entities/Measure";
import { DoubleReport, InvalidData } from "../../../errors/errors";
import { type ICustomerRepository } from "../../../repository/ICustomerRepository";
import { type IMeasureRepository } from "../../../repository/IMeasureRepository";
import { compareDate } from "../../../utils/compareDate";
import { isValidDate } from "../../../utils/isValidDate";
import { type IBase64Validator } from "../../protocols/IBase64Validator";
import { type IResponse, geminiAPI } from "../api/geminiApi";
import { type IUploadUseCase } from "./IUploadUseCase";
import { verifyMeasureTimeIsGreat30Days } from "./verifyMeasureTimeIsGreat30Days";

class UploadUseCase implements IUploadUseCase {
    private readonly base64Validator: IBase64Validator;
    private readonly measureRepository: IMeasureRepository;
    private readonly customerRepository: ICustomerRepository;
    constructor(
        base64Validator: IBase64Validator,
        measureRepository: IMeasureRepository,
        customerRepository: ICustomerRepository,
    ) {
        this.base64Validator = base64Validator;
        this.measureRepository = measureRepository;
        this.customerRepository = customerRepository;
    }

    async execute(data: any): Promise<IResponse> {
        const { image, customer_code, measure_datetime, measure_type } = data;

        if (!image || !customer_code || !measure_datetime || !measure_type) {
            throw new InvalidData("Estão faltando dados", 400);
        }

        if (
            typeof image !== "string" ||
            typeof customer_code !== "string" ||
            typeof measure_datetime !== "string" ||
            typeof measure_type !== "string"
        ) {
            throw new InvalidData("Tipo de dados inválido", 400);
        }

        if (measure_type !== "WATER" && measure_type !== "GAS") {
            throw new InvalidData("Measure_type precisa ser WATER ou GAS", 400);
        }

        if (!isValidDate(measure_datetime)) {
            throw new InvalidData("Data inválida", 400);
        }

        const array64 = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

        if (!array64 || array64.length !== 3) {
            throw new InvalidData("Formato do code64 inválido", 400);
        }

        const mimeType = array64[1];
        const imageBase64 = array64[2];
        const allowMimeType = ["png", "jpg", "jpeg", "webp", "heic", "heif"];

        if (!allowMimeType.includes(mimeType.split("/")[1])) {
            throw new InvalidData("Formato da imagem inválido", 400);
        }

        if (!this.base64Validator.isBase64(imageBase64)) {
            throw new InvalidData("Base64 inválido", 400);
        }
        // ????///////////////////////////////////////////???????????????

        const customerVerificationDatetime =
            await this.customerRepository.findByIdAndReturnRelation(
                parseInt(customer_code),
                measure_type,
            );

        if (!customerVerificationDatetime) {
            throw new InvalidData("Customer_code inválido", 400);
        }

        if (
            verifyMeasureTimeIsGreat30Days(customerVerificationDatetime)
                .length > 0
        ) {
            throw new DoubleReport("Leitura do mês já realizada", 409);
        }

        const result: IResponse = await geminiAPI(imageBase64, mimeType);

        const customer = await this.customerRepository.findById(
            parseInt(customer_code),
        );

        if (!customer) {
            throw new InvalidData("Customer_code inválido", 400);
        }

        const measure = {
            measure_value: result.measure_value,
            measure_uuid: result.measure_uuid,
            measure_datetime,
            measure_type,
            has_confirmed: false,
            image_url: result.image_url,
            customer,
        };

        await this.measureRepository.add(measure);

        return result;
    }
}
export { UploadUseCase };
