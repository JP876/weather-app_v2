const scrollCitiesList = (options?: ScrollToOptions) => {
    const listContainer = [...document.getElementsByClassName("ReactVirtualized__Grid")]?.[0];

    if (listContainer) {
        listContainer.scrollTo({ top: 0, left: 0, behavior: "smooth", ...(options || {}) });
    } else {
        console.warn("Cities list element not found.");
    }
};

export default scrollCitiesList;
