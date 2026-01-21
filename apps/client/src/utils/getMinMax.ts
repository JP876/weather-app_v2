const getMinMax = (min: number, max: number): number => {
    return Math.max(Math.ceil(Math.random() * max), min);
};

export default getMinMax;
