import { type Customer } from "../../../database/entities/Customer";
import { InvalidData } from "../../../errors/errors";
import { type ICustomerRepository } from "../../../repository/ICustomerRepository";
import { type IEmailValidator } from "../../protocols/IEmailValidator";
import { type IEncrypterHash } from "../../protocols/IEncrypterHash";
import { type ICustomer } from "../../protocols/interfaces";
import { CreateCustomerUseCase } from "./CreateCustomerUseCase";

interface ITypesSut {
    sut: CreateCustomerUseCase;
    emailValidatorStub: IEmailValidator;
    encrypterHash: IEncrypterHash;
    customerRepositoryStub: ICustomerRepository;
}
let repository: Customer[];

function makeCustomerRepository(): ICustomerRepository {
    class CustomerRepositoryStub implements ICustomerRepository {
        async add(customer: ICustomer): Promise<Customer> {
            const newCustomer: Customer = { ...customer, customer_code: 1 };
            repository.push(newCustomer);
            return newCustomer;
        }

        async findById(customer_code: number): Promise<Customer | null> {
            const customer = repository.find(
                (customer) => customer.customer_code === customer_code,
            );
            if (!customer) throw Error();
            return customer;
        }

        async findByEmail(email: string): Promise<Customer | null> {
            const customer = repository.find(
                (customer) => customer.email === email,
            );
            if (!customer) return null;
            return customer;
        }

        findByIdAndReturnRelation: (
            customer_code: number,
        ) => Promise<Customer | null | undefined>;
    }
    return new CustomerRepositoryStub();
}

function makeEncrypter(): IEncrypterHash {
    class EncrypterHashStub implements IEncrypterHash {
        async hash(): Promise<string> {
            return await new Promise((resolve) => {
                resolve("hashed_pas");
            });
        }
    }

    return new EncrypterHashStub();
}
function makeEmailValidatorStub(): IEmailValidator {
    class EmailValidatorStub implements IEmailValidator {
        isEmail(email: string): boolean {
            return true;
        }
    }
    return new EmailValidatorStub();
}
function makeSut(): ITypesSut {
    const emailValidatorStub = makeEmailValidatorStub();
    const encrypterHash = makeEncrypter();
    const customerRepositoryStub = makeCustomerRepository();
    const sut = new CreateCustomerUseCase(
        emailValidatorStub,
        encrypterHash,
        customerRepositoryStub,
    );

    return { sut, emailValidatorStub, encrypterHash, customerRepositoryStub };
}

describe("CreateCustomerUseCase", () => {
    beforeEach(() => {
        repository = [];
    });

    it("Shouuld return an error if name is invalid", async () => {
        const fakeCustomer = {
            name: "",
            lastname: "santos",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const { sut } = makeSut();

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Dados inválidos", 400),
        );
    });

    it("Shouuld return an error if lastname is invalid", async () => {
        const fakeCustomer = {
            name: "herik",
            lastname: "",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const { sut } = makeSut();

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Dados inválidos", 400),
        );
    });

    it("Shouuld return an error if email is invalid", async () => {
        const fakeCustomer = {
            name: "teste",
            lastname: "da silva",
            email: "",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const { sut } = makeSut();

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Dados inválidos", 400),
        );
    });

    it("Shouuld return an error if password is invalid", async () => {
        const fakeCustomer = {
            name: "test",
            lastname: "da silva",
            email: "test@gmail.com",
            password: "",
            passwordConfirmation: "123456",
        };

        const { sut } = makeSut();

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Dados inválidos", 400),
        );
    });

    it("Shouuld return an error if lastname is invalid", async () => {
        const fakeCustomer = {
            name: "test",
            lastname: "da silva",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "",
        };

        const { sut } = makeSut();

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Dados inválidos", 400),
        );
    });

    it("Should return a throw if password is different passwordConfirmation", async () => {
        const fakeCustomer = {
            name: "test",
            lastname: "da silva",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123",
        };

        const { sut } = makeSut();

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData(
                "Password e password confirmation devem ser iguais",
                400,
            ),
        );
    });

    it("Should call emailValidator with correct values", async () => {
        const { sut, emailValidatorStub } = makeSut();

        const fakeCustomer = {
            name: "test",
            lastname: "da silva",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const emailValidatorSpy = jest.spyOn(emailValidatorStub, "isEmail");

        await sut.execute(fakeCustomer);

        expect(emailValidatorSpy).toHaveBeenCalledWith(fakeCustomer.email);
    });

    it("Should return a throw if email is not valid", async () => {
        const fakeCustomer = {
            name: "test",
            lastname: "da silva",
            email: "test.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const { sut, emailValidatorStub } = makeSut();

        jest.spyOn(emailValidatorStub, "isEmail").mockReturnValueOnce(false);

        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Email não e válido", 400),
        );
    });

    it("Should call encrypterHash with correct values", async () => {
        const { sut, encrypterHash } = makeSut();

        const fakeCustomer = {
            name: "test",
            lastname: "da silva",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const encrypterSpy = jest.spyOn(encrypterHash, "hash");

        await sut.execute(fakeCustomer);

        expect(encrypterSpy).toHaveBeenCalledWith(fakeCustomer.password);
    });

    it("Should call customerRepository with correct values", async () => {
        const { sut, customerRepositoryStub } = makeSut();

        const fakeCustomer = {
            name: "test",
            lastname: "da silva",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const peito = {
            name: "test",
            lastname: "da silva",
            email: "test@gmail.com",
            password: "hashed_pas",
        };

        const customerRepositorySpy = jest.spyOn(customerRepositoryStub, "add");

        await sut.execute(fakeCustomer);

        expect(customerRepositorySpy).toHaveBeenCalledWith(peito);
    });

    it("Should return a correct customer if create was sucess", async () => {
        const { sut } = makeSut();

        const fakeCustomer = {
            name: "test",
            lastname: "da silva",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const createdCustomer = await sut.execute(fakeCustomer);

        expect(createdCustomer).toHaveProperty("customer_code");
    });

    it("Should return a correct customer findById", async () => {
        const { sut, customerRepositoryStub } = makeSut();

        const fakeCustomer = {
            name: "test",
            lastname: "da silva",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const createdCustomer = await sut.execute(fakeCustomer);
        const findedCustomer = await customerRepositoryStub.findById(
            createdCustomer.customer_code,
        );

        expect(createdCustomer).toEqual(findedCustomer);
    });

    it("Should return a thorw if customer email already exists", async () => {
        const { sut } = makeSut();

        const fakeCustomer = {
            name: "test",
            lastname: "da silva",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        await sut.execute(fakeCustomer);
        await expect(sut.execute(fakeCustomer)).rejects.toEqual(
            new InvalidData("Cliente já existe", 400),
        );
    });
});
