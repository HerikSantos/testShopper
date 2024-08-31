import { type Repository } from "typeorm";

import { appDataSource } from "../database";
import { Customer } from "../database/entities/Customer";
import { InvalidData } from "../errors/errors";
import {
    type ICustomerRepository,
    type ICustomer,
} from "./ICustomerRepository";

class CustomerRepository implements ICustomerRepository {
    private readonly repository: Repository<Customer>;

    constructor() {
        this.repository = appDataSource.getRepository(Customer);
    }

    findByIdAndCompareDate: (
        customer_code: number,
        measure_type: string,
    ) => Promise<Customer | null | undefined>;

    async add(customer: ICustomer): Promise<Customer> {
        const newCustomer = this.repository.create(customer);

        await this.repository.save(newCustomer);

        const onlyCustomerCode = await this.repository.findOne({
            where: { customer_code: newCustomer.customer_code },
            select: { customer_code: true },
        });

        if (!onlyCustomerCode) {
            throw new InvalidData("Customer_code inválido", 400);
        }

        return onlyCustomerCode;
    }

    async findById(customer_code: number): Promise<Customer | null> {
        return await this.repository.findOneBy({
            customer_code,
        });
    }

    async findByEmail(email: string): Promise<Customer | null> {
        return await this.repository.findOneBy({ email });
    }

    async findByIdAndReturnRelation(
        customer_code: number,
        measure_type?: string | undefined,
    ): Promise<Customer | null | undefined> {
        const customerCustomerCode = customer_code;

        const customer = await this.repository
            .createQueryBuilder("customer")
            .leftJoin("customer.measures", "measure")
            .select([
                "customer.customer_code",
                "measure.measure_uuid",
                "measure.measure_datetime",
                "measure.measure_type",
                "measure.has_confirmed",
                "measure.image_url",
            ])
            .where("customer.customer_code = :customerCustomerCode", {
                customerCustomerCode,
            })
            .andWhere(
                "measure.measure_type LIKE :measureType OR measure.measure_type IS NULL",
                {
                    measureType: `%${measure_type ?? ""}%`,
                },
            )
            .getOne();

        return customer;
    }
}

export { CustomerRepository };
