import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Measure } from "./Measure";

@Entity()
class Customer {
    @PrimaryGeneratedColumn()
    customer_code: number;

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Measure, (measure) => measure.customer)
    measures?: Measure[];

    @CreateDateColumn()
    createdAt?: string;

    @CreateDateColumn()
    updateAt?: string;
}

export { Customer };
