interface IEncrypterHash {
    hash: (password: string) => Promise<string>;
}

export type { IEncrypterHash };
