'use client';

import { useReducer, useEffect } from 'react';
import { clientsReducer, initialState } from '../reducers/clientReducer';

export default function ClientsFilterBar({
  clientsData,
  setFilteredClients,
  onNewClient,
}) {
  const [state, dispatch] = useReducer(clientsReducer, initialState);

  // Function to get unique cities from the clients data
  const getUniqueCities = (clients) => {
    const cities = clients
      .map((client) => client.address?.city)
      .filter(Boolean);
    return [...new Set(cities)]; // Remove duplicates by converting to a Set and back to an array
  };

  // Filter function to apply filters on clients data
  const applyFilters = (clients) => {
    let filtered = clients;

    if (state.searchName) {
      filtered = filtered.filter((client) =>
        `${client.name} ${client.lastName}`
          .toLowerCase()
          .includes(state.searchName.toLowerCase())
      );
    }

    if (state.selectedService) {
      filtered = filtered.filter((client) =>
        client.services.some(
          (service) => service.type === state.selectedService
        )
      );
    }

    if (state.startDate) {
      filtered = filtered.filter((client) =>
        client.services.some((service) => service.startDate >= state.startDate)
      );
    }

    if (state.endDate) {
      filtered = filtered.filter((client) =>
        client.services.some((service) => service.endDate <= state.endDate)
      );
    }

    if (state.selectedCity) {
      filtered = filtered.filter(
        (client) =>
          client.address &&
          client.address.city &&
          typeof client.address.city === 'string' &&
          client.address.city
            .toLowerCase()
            .includes(state.selectedCity.toLowerCase())
      );
    }

    setFilteredClients(filtered); // Update parent component's state
  };

  // useEffect to apply filters when the state changes
  useEffect(() => {
    applyFilters(clientsData); // Apply the filter immediately when the state changes
  }, [state, clientsData]);

  // Clear filters and reset state
  const clearFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  // Get unique cities for the dropdown
  const uniqueCities = getUniqueCities(clientsData);

  return (
    <div className="flex justify-between mb-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onNewClient}
          className="bg-blue-500 hover:bg-primaryhover text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md"
        >
          Naujas Klientas
        </button>

        {/* Search by Name */}
        <input
          type="text"
          placeholder="Filtruoti pagal vardą"
          value={state.searchName}
          onChange={(e) =>
            dispatch({ type: 'SET_SEARCH_NAME', payload: e.target.value })
          }
          className="border p-2 rounded-lg shadow-md outline-none text-sm"
        />

        {/* Service Filter */}
        <select
          value={state.selectedService}
          onChange={(e) =>
            dispatch({ type: 'SET_SELECTED_SERVICE', payload: e.target.value })
          }
          className="border p-2 rounded-lg shadow-md outline-none text-sm"
        >
          <option value="">Turima paslauga</option>
          <option value="Internetas">Internetas</option>
          <option value="IPTV">IPTV</option>
        </select>

        {/* Start Date Filter */}
        <input
          type="date"
          value={state.startDate}
          onChange={(e) =>
            dispatch({ type: 'SET_START_DATE', payload: e.target.value })
          }
          className="border p-2 rounded-lg shadow-md outline-none text-sm"
        />

        {/* End Date Filter */}
        <input
          type="date"
          value={state.endDate}
          onChange={(e) =>
            dispatch({ type: 'SET_END_DATE', payload: e.target.value })
          }
          className="border p-2 rounded-lg shadow-md outline-none text-sm"
        />

        {/* City Filter */}
        <select
          value={state.selectedCity}
          onChange={(e) =>
            dispatch({ type: 'SET_SELECTED_CITY', payload: e.target.value })
          }
          className="border p-2 rounded-lg shadow-md outline-none text-sm"
        >
          <option value="">Miestas</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        <button
          className="border p-2 rounded-lg shadow-md outline-none text-sm"
          onClick={clearFilters}
        >
          Pašalinti Filtrus
        </button>
      </div>
    </div>
  );
}
