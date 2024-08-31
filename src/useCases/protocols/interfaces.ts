import { type Customer } from "../../database/entities/Customer";

interface ICustomer {
    name: string;
    lastname: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

interface IDbCustomer {
    customer_code: number;
    name: string;
    lastname: string;
    email: string;
}

interface IMeasure {
    measure_value: number;
    measure_uuid: string;
    measure_datetime: string;
    measure_type: string;
    has_confirmed: boolean;
    image_url: string;
    customer: Customer;
}

export type { ICustomer, IDbCustomer, IMeasure };
