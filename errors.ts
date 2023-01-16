export type Result<T, E> = {
    Ok: {
        value: T,
    },
    Err?: E
    
    isOk: () => boolean,
    isErr: () => boolean,
}

// We want a matcher to extract the value from the result
// and handle the error case
export const match = <T, E, R>(result: Result<T, E>, onOk: (value: T) => R, onErr: (error: E) => R): R => {
    if (result.Err) {
        return onErr(result.Err);
    } else {
        return onOk(result.Ok.value);
    }
}

export const Ok = <T, E>(value: T): Result<T, E> => ({
    Ok: {
        value,
    },
    isOk: () => true,
    isErr: () => false,
})

export const Err = <T, E>(error: E): Result<T, E> => ({
    Ok: {
        value: {} as T,
    },
    Err: error,
    isErr: () => true,
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
    constructor(description?: string) {
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