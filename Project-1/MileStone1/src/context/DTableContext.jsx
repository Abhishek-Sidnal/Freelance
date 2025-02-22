import React, { createContext, useState, useMemo } from "react";
import { stateForCountries } from "../utils/countriesData";

export const DTableContext = createContext();

export const DTableProvider = ({ children }) => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [expandAll, setExpandAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalData, setModalData] = useState(null);
  const [filters, setFilters] = useState({
    countries: [],
    states: [],
    capitals: [],
    populations: [],
    hdis: [],
  });

  const [countries, setCountries] = useState(
    stateForCountries.map((country) => ({
      ...country,
      states: country.states.slice(0, 4),
    }))
  );

  const [modalInputs, setModalInputs] = useState({
    stateName: "",
    capital: "",
    population: "",
    hdi: "",
  });

  const toggleRow = (id) => {
    if (expandAll) setExpandAll(false);
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleExpandAll = () => {
    setExpandAll((prev) => {
      const newExpandAll = !prev;
      setExpandedRows(newExpandAll ? countries.map((_, index) => index) : []);
      return newExpandAll;
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleActionClick = (country) => {
    const fullStates = stateForCountries.find(
      (c) => c.Country_Name === country.Country_Name
    ).states;

    setModalData({
      ...country,
      allStates: fullStates,
    });

    setModalInputs({
      stateName: "",
      capital: "",
      population: "",
      hdi: "",
    });
  };

  const handleModalInputChange = (e) => {
    const { id, value } = e.target;

    if (id === "stateName") {
      const selectedState = modalData.allStates.find((state) => state.name === value);
      setModalInputs({
        stateName: selectedState?.name || "",
        capital: selectedState?.capital || "",
        population: selectedState?.population || "",
        hdi: selectedState?.hdi || "",
      });
    } else {
      setModalInputs((prev) => ({
        ...prev,
        [id]: id === "population" || id === "hdi" ? Number(value) : value,
      }));
    }
  };

  const handleAddOrUpdateState = (stateName, capital, population, hdi) => {
    if (!stateName || !capital || !population || !hdi) {
      alert("All fields are required.");
      return;
    }

    setCountries((prev) =>
      prev.map((country) =>
        country.Country_Name === modalData.Country_Name
          ? {
              ...country,
              states: country.states.some((state) => state.name === stateName)
                ? country.states.map((state) =>
                    state.name === stateName
                      ? { ...state, capital, population, hdi }
                      : state
                  )
                : [
                    ...country.states,
                    {
                      name: stateName,
                      capital,
                      population,
                      hdi,
                    },
                  ],
            }
          : country
      )
    );
    closeModal();
  };

  const closeModal = () => {
    setModalData(null);
    setModalInputs({
      stateName: "",
      capital: "",
      population: "",
      hdi: "",
    });
  };

  const toggleFilter = (type, item) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(item)
        ? prev[type].filter((i) => i !== item)
        : [...prev[type], item],
    }));
  };

  const filteredCountries = useMemo(() => {
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
          country.Country_Name.toLowerCase().includes(searchQuery) ||
          country.states.some(
            (state) =>
              state.name.toLowerCase().includes(searchQuery) ||
              state.capital.toLowerCase().includes(searchQuery)
          )
      );
  }, [countries, filters, searchQuery]);

  const disabledItems = useMemo(
    () => (type) => {
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

      const disabledFromStates = filters.states.flatMap((stateName) =>
        countries.flatMap((country) =>
          country.states
            .filter((state) => state.name === stateName)
            .flatMap((state) =>
              type === "capitals"
                ? state.capital
                : type === "populations"
                ? state.population
                : state.hdi
            )
        )
      );

      const disabledFromCapitals = filters.capitals.flatMap((capitalName) =>
        countries.flatMap((country) =>
          country.states
            .filter((state) => state.capital === capitalName)
            .flatMap((state) =>
              type === "populations"
                ? state.population
                : type === "hdis"
                ? state.hdi
                : []
            )
        )
      );

      const disabledFromPopulations = filters.populations.flatMap((population) =>
        countries.flatMap((country) =>
          country.states
            .filter((state) => state.population === population)
            .map((state) => state.hdi)
        )
      );

      const disabled = [
        ...disabledFromCountries,
        ...disabledFromStates,
        ...disabledFromCapitals,
        ...disabledFromPopulations,
      ];

      return disabled;
    },
    [countries, filters]
  );

  return (
    <DTableContext.Provider
      value={{
        expandedRows,
        expandAll,
        searchQuery,
        modalData,
        filters,
        countries,
        modalInputs,
        toggleRow,
        toggleExpandAll,
        handleSearch,
        handleActionClick,
        handleModalInputChange,
        handleAddOrUpdateState,
        closeModal,
        toggleFilter,
        filteredCountries,
        disabledItems,
      }}
    >
      {children}
    </DTableContext.Provider>
  );
};
