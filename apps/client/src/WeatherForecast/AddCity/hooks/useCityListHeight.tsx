import { useEffect, useMemo, useState } from "react";

const useCityListHeight = () => {
    const [height, setHeight] = useState<number | null>(null);

    useEffect(() => {
        const container = document.getElementById("wether-forecast-container");
        const tabsContainer = document.getElementById("cities-navigation-tabs-container");
        const searchContainer = document.getElementById("city-search-container");

        const resizeObserver = new ResizeObserver(() => {
            if (!container || !tabsContainer || !searchContainer) {
                return;
            }
            setHeight(
                container.clientHeight -
                    tabsContainer.clientHeight -
                    searchContainer.clientHeight -
                    2,
            );
        });

        if (container) {
            resizeObserver.observe(container);
        }
        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return useMemo(() => ({ height }), [height]);
};

export default useCityListHeight;
