const scrollCitiesList = (options?: ScrollToOptions, id?: string) => {
    let listContainer: Element | null = [
        ...document.getElementsByClassName("ReactVirtualized__Grid"),
    ]?.[0];

    if (id) {
        listContainer = document.getElementById(id);
    }

    if (listContainer) {
        listContainer.scrollTo({ top: 0, left: 0, behavior: "smooth", ...(options || {}) });
    } else {
        console.warn("Cities list element not found.");
    }
};

export default scrollCitiesList;
