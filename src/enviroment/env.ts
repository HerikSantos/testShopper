import dotenv from "dotenv";
import { string, z } from "zod";

dotenv.config();

const envSchema = z.object({
    GEMINI_API_KEY: string(),
});

const env = envSchema.parse(process.env);

export { env };
