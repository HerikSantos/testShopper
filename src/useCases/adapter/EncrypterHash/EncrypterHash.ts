import bcrypt from "bcryptjs";

class EncrypterHash {
    constructor(private readonly salt: number) {}

    async hash(password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, this.salt);
        return hashedPassword;
    }
}

export { EncrypterHash };
