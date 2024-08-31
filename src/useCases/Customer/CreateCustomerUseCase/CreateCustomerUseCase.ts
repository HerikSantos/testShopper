import { InvalidData } from "../../../errors/errors";
import { type ICustomerRepository } from "../../../repository/ICustomerRepository";
import { type IEmailValidator } from "../../protocols/IEmailValidator";
import { type IEncrypterHash } from "../../protocols/IEncrypterHash";
import { type IDbCustomer, type ICustomer } from "../../protocols/interfaces";
import { type ICreateCustomerUseCase } from "./ICreateCustomerUseCase";

class CreateCustomerUseCase implements ICreateCustomerUseCase {
    private readonly emailValidator: IEmailValidator;
    private readonly encrypterHash: IEncrypterHash;
    private readonly customerRepository: ICustomerRepository;

    constructor(
        emailValidator: IEmailValidator,
        encrypterHash: IEncrypterHash,
        customerRepository: ICustomerRepository,
    ) {
        this.emailValidator = emailValidator;
        this.encrypterHash = encrypterHash;
        this.customerRepository = customerRepository;
    }

    async execute(data: any): Promise<IDbCustomer> {
        const { name, lastname, email, password, passwordConfirmation } =
            data as ICustomer;

        if (
            !name ||
            !lastname ||
            !email ||
            !password ||
            !passwordConfirmation
        ) {
            throw new InvalidData("Dados inválidos", 400);
        }

        if (password !== passwordConfirmation) {
            throw new InvalidData(
                "Password e password confirmation devem ser iguais",
                400,
            );
        }

        if (!this.emailValidator.isEmail(email)) {
            throw new InvalidData("Email não e válido", 400);
        }

        const passwordHashed = await this.encrypterHash.hash(password);

        const customerExists = await this.customerRepository.findByEmail(email);

        if (customerExists && customerExists.email === email)
            throw new InvalidData("Cliente já existe", 400);

        const createdCustomer = await this.customerRepository.add({
            name,
            lastname,
            email,
            password: passwordHashed,
        });

        return createdCustomer;
    }
}

export { CreateCustomerUseCase };
