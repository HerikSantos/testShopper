import validator from "validator";

import { Base64Validator } from "./base64Validator";

jest.mock("validator", () => ({
    isBase64: () => true,
}));

describe("base64 validator", () => {
    it("Should that call base64Validator with correct params", () => {
        const sut = new Base64Validator();
        const isBase64Spy = jest.spyOn(validator, "isBase64");

        sut.isBase64("valid_base64");

        expect(isBase64Spy).toHaveBeenCalledWith("valid_base64");
    });

    it("Should returns false if invalid base64", () => {
        const sut = new Base64Validator();

        const invalidBase64 = "invalidBase64";

        jest.spyOn(sut, "isBase64").mockImplementationOnce(() => false);

        const result = sut.isBase64(invalidBase64);

        expect(result).toBe(false);
    });

    it("Should returns true if valid base64", () => {
        const sut = new Base64Validator();

        const validBase64 = "validBase64";
        const result = sut.isBase64(validBase64);

        expect(result).toBe(true);
    });

    it("Should throws if throws", async () => {
        const sut = new Base64Validator();

        jest.spyOn(sut, "isBase64").mockImplementationOnce(() => {
            throw new Error();
        });

        const invalidBase64 = "invalidBase64";

        expect(() => sut.isBase64(invalidBase64)).toThrow();
    });
});
