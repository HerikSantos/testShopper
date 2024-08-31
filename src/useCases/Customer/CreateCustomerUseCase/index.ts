import { CustomerRepository } from "../../../repository/CustomerRepository";
import { EmailValidator } from "../../adapter/EmailValidator/EmailValidator";
import { EncrypterHash } from "../../adapter/EncrypterHash/EncrypterHash";
import { CreateCustomerUseCase } from "./CreateCustomerUseCase";

const salt = 10;

const encrypterHash = new EncrypterHash(salt);
const emailValidator = new EmailValidator();
const customerRepository = new CustomerRepository();

const createCustomerUseCase = new CreateCustomerUseCase(
    emailValidator,
    encrypterHash,
    customerRepository,
);

export { createCustomerUseCase };
