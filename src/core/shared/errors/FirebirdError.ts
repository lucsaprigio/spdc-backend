/* eslint-disable @typescript-eslint/no-explicit-any */
interface FirebirdErrorOptions {
    message: string;
    code?: number;
    firebirdCode?: number;
    originalError?: any;
}


export class FirebirdError extends Error {
    public statusCode: number;
    public firebirdCode: number;
    originalError?: object;

    constructor(options: FirebirdErrorOptions, statusCode: number, firebirdCode: number) {
        super(options.message);
        this.statusCode = statusCode;
        this.firebirdCode = firebirdCode;
        this.originalError = options.originalError;
        this.message = options.message;
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            firebirdCode: this.firebirdCode,
            ...(this.originalError && { originalError: this.originalError }),
        };
    }
}