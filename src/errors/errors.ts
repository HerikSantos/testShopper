class InvalidData extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, InvalidData.prototype);
    }
}

class InvalidType extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, InvalidType.prototype);
    }
}

class MeasuresNotFound extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, MeasuresNotFound.prototype);
    }
}

class DoubleReport extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, DoubleReport.prototype);
    }
}

class ConfirmationDuplicate extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, ConfirmationDuplicate.prototype);
    }
}

export {
    InvalidData,
    InvalidType,
    MeasuresNotFound,
    DoubleReport,
    ConfirmationDuplicate,
};
