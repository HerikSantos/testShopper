import { type Customer } from "../database/entities/Customer";

interface ICustomer {
    name: string;
    lastname: string;
    email: string;
    password: string;
}

interface ICustomerRepository {
    add: (customer: ICustomer) => Promise<Customer>;
    findById: (customer_code: number) => Promise<Customer | null>;
    findByEmail: (email: string) => Promise<Customer | null>;
    findByIdAndReturnRelation: (
        customer_code: number,
        measure_type?: string | undefined,
    ) => Promise<Customer | null | undefined>;
}

export type { ICustomerRepository, ICustomer };
