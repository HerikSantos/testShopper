import { CustomerRepository } from "../../../repository/CustomerRepository";
import { ListMeasureUseCase } from "./ListMeasureUseCase";

const customerRepository = new CustomerRepository();
const listMeasureUseCase = new ListMeasureUseCase(customerRepository);
export { listMeasureUseCase };
