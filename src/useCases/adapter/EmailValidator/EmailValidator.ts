import validator from "validator";

import { type IEmailValidator } from "../../protocols/IEmailValidator";

class EmailValidator implements IEmailValidator {
    isEmail(email: string): boolean {
        return validator.isEmail(email);
    }
}

export { EmailValidator };
