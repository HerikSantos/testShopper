import validator from "validator";

import { type IBase64Validator } from "../../protocols/IBase64Validator";

class Base64Validator implements IBase64Validator {
    isBase64(str: string): boolean {
        return validator.isBase64(str);
    }
}

export { Base64Validator };
