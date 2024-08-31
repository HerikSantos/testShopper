import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

import { env } from "../../../enviroment/env";
import { InvalidData } from "../../../errors/errors";

interface IResponse {
    image_url: string;
    measure_value: number;
    measure_uuid: string;
}

async function geminiAPI(
    imageBase64: string,
    mimeType: string,
): Promise<IResponse> {
    const genAi = new GoogleGenerativeAI(env.GEMINI_API_KEY);

    const model = genAi.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    // //////////////////////////////////////////////////////////////

    const buffer = Buffer.from(imageBase64, "base64");

    await fs.writeFile("imageQualquer", buffer);

    const fileManager = new GoogleAIFileManager(env.GEMINI_API_KEY);
    const uploadResponse = await fileManager.uploadFile("imageQualquer", {
        mimeType,
        displayName: `${Date.now()}-readWaterOrGas`,
        name: uuidv4(),
    });
    await fs.unlink("imageQualquer");
    const fileID = uploadResponse.file.name;

    const image = await fileManager.getFile(fileID);

    const result = await model.generateContent([
        {
            inlineData: { data: imageBase64, mimeType },
        },
        {
            text: "Qual o valor do consumo de água ou gás nesse medidor? Somente números",
        },
    ]);

    const measure_value = result.response.text().match(/\d+/g);

    if (!measure_value || measure_value.length > 1) {
        throw new InvalidData("Image is not valid", 400);
    }

    return {
        image_url: image.uri,
        measure_value: parseInt(measure_value[0]),
        measure_uuid: image.name.split("/")[1],
    };
}

export { geminiAPI, type IResponse };
