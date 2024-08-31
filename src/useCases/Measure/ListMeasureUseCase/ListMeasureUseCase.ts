import { format } from "date-fns";

import { type Customer } from "../../../database/entities/Customer";
import {
    InvalidData,
    InvalidType,
    MeasuresNotFound,
} from "../../../errors/errors";
import { type ICustomerRepository } from "../../../repository/ICustomerRepository";
import { type IListMeasureUseCase } from "./IListMeasureUseCase";

class ListMeasureUseCase implements IListMeasureUseCase {
    private readonly customerRepository: ICustomerRepository;
    constructor(customerRepository: ICustomerRepository) {
        this.customerRepository = customerRepository;
    }

    async execute(customer_code: any, queryString?: any): Promise<Customer> {
        if (typeof customer_code !== "string") {
            throw new InvalidData("Tipo invállido costumer_code", 400);
        }

        if (
            typeof queryString !== "string" &&
            typeof queryString !== "undefined"
        ) {
            throw new InvalidData("Filtro measure_type não é válido", 400);
        }

        if (queryString) {
            if (queryString !== "WATER" && queryString !== "GAS") {
                throw new InvalidType("Tipo de medição não permitida", 400);
            }
        }

        const customer =
            await this.customerRepository.findByIdAndReturnRelation(
                parseInt(customer_code),
                queryString,
            );

        if (!customer) {
            throw new InvalidData("Costumer_code inválido", 400);
        }

        if (customer.measures && customer.measures.length <= 0) {
            throw new MeasuresNotFound("Nenhuma leitura encontrada", 404);
        }

        customer.measures?.map(
            (mea) =>
                (mea.measure_datetime = format(
                    mea.measure_datetime,
                    "yyyy-MM-dd hh:mm:ss",
                )),
        );

        const customerWithCustomerCodeString = Object.assign({}, customer, {
            customer_code: `${customer_code}`,
        });
        return customerWithCustomerCodeString;
    }
}

export { ListMeasureUseCase };
