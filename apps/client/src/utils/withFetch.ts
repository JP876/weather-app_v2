class NetworkError extends Error {
    constructor(msg?: string) {
        super(msg);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = "NetworkError";
    }
}

class APIError extends Error {
    constructor(msg?: string) {
        super(msg);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = "APIError";
    }
}

async function withFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
): Promise<[null, Response] | [Error, null]> {
    try {
        let res: Response | null = null;

        try {
            res = await fetch(input, init);
        } catch (err: unknown) {
            const error = err as Error;
            throw new NetworkError(error.message);
        }

        if (!res.ok) {
            throw new APIError("Failed to fetch resources");
        }

        return [null, res];
    } catch (err) {
        const error = err as NetworkError | APIError | ReferenceError;
        return [error, null];
    }
}

export default withFetch;
