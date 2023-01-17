export const match = <T, E>(result: Result<T, E>, handlers: { Ok: (value: T) => T, Err: (error: E) => E }) => {
    if (result.isOk()) {
        return handlers.Ok(result.Ok.value);
    } else {
        return handlers.Err(result.Err ?? {} as E);
    }
}

export const Ok = <T, E>(value: T): Result<T, E> => ({
    Ok: {
        value,
    },
    isOk: () => true,
    isErr: () => value === undefined,
})

export const Err = <T, E>(error: E): Result<T, E> => ({
    Ok: {
        value: {} as T,
    },
    Err: error,
    isErr: () => error !== undefined,
    isOk: () => false,
})

export class GenericError {
    message: string;
    help: string;
    description: string;
    code: number;
    line?: {
        content: string,
        number: number,
    }

    constructor(message: string, code: number, help?: string, description?: string) {
        this.message = message;
        this.code = code;
        this.help = help ?? "";
        this.description = description ?? "";
    }

    public UserFacingMessage() {
        return `\x1b[31;1m${this.message}\tCode: ${this.code}\n${this.description}\x1b[0;0m`;
    }

    public FullMessage() {
        return JSON.stringify(this, null, 4);
    }
}

export class ConnectionError extends GenericError {

    constructor(description: string) {
        const message = "Connection Error";
        const code = 1;
        const help = "Check your internet connection and try again";

        super(message, code, help, description);
    }
}

export class NotFoundError extends GenericError {
    constructor(description?: string) {
        const message = "Not Found";
        const code = 2;
        const help = "Check the link and try again";

        super(message, code, help, description);
    }
}