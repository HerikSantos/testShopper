import { type Customer } from "../../../database/entities/Customer";

interface IListMeasureUseCase {
    execute: (customer_code: any, queryString?: any) => Promise<Customer>;
}

export type { IListMeasureUseCase };
