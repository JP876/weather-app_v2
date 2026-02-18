import { useCallback, useMemo, useState } from "react";

const useDelay = (ms?: number) => {
    const [loading, setLoading] = useState(false);

    const start = useCallback(async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, ms || 500));
        setLoading(false);
    }, [ms]);

    return useMemo(() => ({ loading, start }), [loading, start]);
};

export default useDelay;
