import bcrypt from "bcryptjs";

import { EncrypterHash } from "./EncrypterHash";

jest.mock("bcryptjs", () => ({
    async hash(): Promise<string> {
        return await new Promise((resolve) => {
            resolve("hashedPassword");
        });
    },
}));

describe("EcrypterHash", () => {
    it("Should return throw if throws", async () => {
        const salt = 10;
        const sut = new EncrypterHash(salt);

        jest.spyOn(sut, "hash").mockImplementationOnce(async () => {
            return await Promise.reject(new Error());
        });

        await expect(sut.hash("any_password")).rejects.toThrow();
    });

    it("Should call bcrypt hash with correct params", async () => {
        const salt = 10;
        const sut = new EncrypterHash(salt);

        const hashSpy = jest.spyOn(bcrypt, "hash");

        await sut.hash("any_password");

        expect(hashSpy).toHaveBeenCalledWith("any_password", salt);
    });

    it("Should return hashedPassword if sucess", async () => {
        const salt = 10;
        const sut = new EncrypterHash(salt);

        const result = await sut.hash("any_password");

        expect(result).toBe("hashedPassword");
    });
});
