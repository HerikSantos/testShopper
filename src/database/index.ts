import dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

const appDataSource = new DataSource({
    type: "mysql",
    host: "db",
    port: 3306,
    database: "testeShopper",
    username: "root",
    password: "123456",
    synchronize: true,
    logging: true,
    entities: [
        process.env.NODE_ENV
            ? "./dist/database/entities/*.js"
            : "./src/database/entities/*.ts",
    ],
    subscribers: [],
    migrations: [
        process.env.NODE_ENV
            ? "./dist/database/migrations/*.js"
            : "./src/database/migrations/*.ts",
    ],
});

export { appDataSource };
