import validator from "validator";

import { EmailValidator } from "./EmailValidator";

describe("Email validator", () => {
    it("Should that call emailValidator with correct params", () => {
        const sut = new EmailValidator();
        const isEmailSpy = jest.spyOn(validator, "isEmail");

        sut.isEmail("teste@gmail.com");

        expect(isEmailSpy).toHaveBeenCalledWith("teste@gmail.com");
    });

    it("Should returns false if invalid email", () => {
        const sut = new EmailValidator();

        const invalidEmail = "teste.com";

        const result = sut.isEmail(invalidEmail);

        expect(result).toBe(false);
    });

    it("Should returns true if valid email", () => {
        const sut = new EmailValidator();

        const invalidEmail = "teste@gmail.com";

        const result = sut.isEmail(invalidEmail);

        expect(result).toBe(true);
    });

    it("Should throws if throws", async () => {
        const sut = new EmailValidator();

        jest.spyOn(sut, "isEmail").mockImplementationOnce(() => {
            throw new Error();
        });

        expect(() => sut.isEmail("emailteste.com")).toThrow();
    });
});
