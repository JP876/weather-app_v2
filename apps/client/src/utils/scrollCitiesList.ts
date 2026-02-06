const scrollCitiesList = (top = 0) => {
    const listContainer = [...document.getElementsByClassName("ReactVirtualized__Grid")]?.[0];

    if (listContainer) {
        listContainer.scrollTo({ top, left: 0, behavior: "smooth" });
    } else {
        console.warn("Cities list element not found.");
    }
};

export default scrollCitiesList;
