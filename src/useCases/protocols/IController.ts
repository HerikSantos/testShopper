import { type Request, type Response } from "express";

interface IController {
    handle: (request: Request, response: Response) => Promise<Response>;
}

export type { IController };
