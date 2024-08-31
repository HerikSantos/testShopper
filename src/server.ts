//
import { appDataSource } from "./database/index";
import { app } from "./index";
import dotenv from "dotenv";

dotenv.config()


appDataSource
    .initialize()
    .then(() =>
        app.listen(3000, () => {
            console.log("rodando na porta " + 3000);
        }),
    )
    .catch((err: Error) => {
        console.log(`Algo deu errado com o banco de dados ${err.stack}`);
    });
