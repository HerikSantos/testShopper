import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Customer } from "./Customer";

@Entity()
class Measure {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    measure_uuid: string;

    @Column()
    measure_value: number;

    @Column({ type: "datetime" })
    measure_datetime: string;

    @Column()
    measure_type: string;

    @Column()
    has_confirmed: boolean;

    @Column()
    image_url: string;

    @ManyToOne(() => Customer, (customer) => customer.measures)
    customer: Customer;

    @CreateDateColumn()
    createdAt?: string;

    @CreateDateColumn()
    updateAt?: string;
}

export { Measure };
