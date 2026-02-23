type WithFetchOptions = {
    delay?: number;
};

export type WithFetchErrors =
    | { type: "NETWORK_ERROR"; error: Error }
    | { type: "API_ERROR"; error: Error };

async function withFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
    options?: WithFetchOptions,
): Promise<[null, Response] | [WithFetchErrors, null]> {
    let res: Response | null = null;

    try {
        [res] = await Promise.all([
            fetch(input, init),
            new Promise((resolve) => setTimeout(resolve, options?.delay || 0)),
        ]);
    } catch (err: unknown) {
        const error = err as Error;
        return [{ type: "NETWORK_ERROR", error }, null];
    }

    if (!res.ok) {
        const error = new Error(`Failed to fetch resources. Status text: ${res.statusText}`);
        return [{ type: "API_ERROR", error }, null];
    }

    return [null, res];
}

export default withFetch;
