
export const filterCountries = (countries, filters, query) => {
    return countries
        .filter((country) => !filters.countries.includes(country.Country_Name))
        .map((country) => ({
            ...country,
            states: country.states
                .filter((state) => !filters.states.includes(state.name))
                .filter((state) => !filters.capitals.includes(state.capital))
                .filter((state) => !filters.populations.includes(state.population))
                .filter((state) => !filters.hdis.includes(state.hdi)),
        }))
        .filter(
            (country) =>
                country.Country_Name.toLowerCase().includes(query) ||
                country.states.some(
                    (state) =>
                        state.name.toLowerCase().includes(query) ||
                        state.capital.toLowerCase().includes(query)
                )
        );
};
export const disabledItems = (type) => {
    const disabledFromCountries = countries
        .filter((country) => filters.countries.includes(country.Country_Name))
        .flatMap((country) =>
            type === "states"
                ? country.states.map((state) => state.name)
                : type === "capitals"
                    ? country.states.map((state) => state.capital)
                    : type === "populations"
                        ? country.states.map((state) => state.population)
                        : country.states.map((state) => state.hdi)
        );

    return disabledFromCountries;
};


export const toggleFilter = (type, item) => {
    setFilters((prev) => ({
        ...prev,
        [type]: prev[type].includes(item)
            ? prev[type].filter((i) => i !== item)
            : [...prev[type], item],
    }));
};

