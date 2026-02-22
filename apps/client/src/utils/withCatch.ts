function withCatch<T, E extends new (message?: string) => Error>(
    promise: Promise<T>,
    errorsToCatch?: E[],
): Promise<[null, T] | [InstanceType<E>, null]> {
    return promise
        .then((data) => {
            return [null, data] as [null, T];
        })
        .catch((error) => {
            if (!errorsToCatch || errorsToCatch.some((e) => error instanceof e)) {
                return [error, null];
            }
            throw error;
        });
}

export default withCatch;
