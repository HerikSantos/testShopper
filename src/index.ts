import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";

import { errorPrevent } from "./middleware/errorPrevent";
import { customerRoute } from "./routes/customerRoute";
import { measureRoute } from "./routes/measureRoute";
dotenv.config();

const app = express();

app.use(
    cors({
        origin: "*",
        allowedHeaders: ["content-type"],
    }),
);
app.use(express.json({ limit: "10mb" }));
app.use(customerRoute);
app.use(measureRoute);
app.use(errorPrevent);

export { app };
