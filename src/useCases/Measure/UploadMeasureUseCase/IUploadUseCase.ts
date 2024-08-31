import { type IResponse } from "../api/geminiApi";

interface IUploadUseCase {
    execute: (data: any) => Promise<IResponse>;
}

export type { IUploadUseCase };
