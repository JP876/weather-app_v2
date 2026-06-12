const compareObjects = (firstObj: unknown, secondObj: unknown): boolean => {
    if (firstObj === secondObj) return true;

    if (
        typeof firstObj !== "object" ||
        typeof secondObj !== "object" ||
        firstObj === null ||
        secondObj === null
    ) {
        return false;
    }

    const firstKeys = Object.keys(firstObj);
    const secondKeys = Object.keys(secondObj);

    if (firstKeys.length !== secondKeys.length) return false;

    for (const key of firstKeys) {
        if (!(key in secondObj)) return false;

        const firstValue = firstObj[key as keyof typeof firstObj];
        const secondValue = secondObj[key as keyof typeof secondObj];

        if (!compareObjects(firstValue, secondValue)) return false;
    }

    return true;
};

export default compareObjects;
