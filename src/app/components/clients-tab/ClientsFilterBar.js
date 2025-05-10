'use client';

import { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { lt } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('lt', lt);
export default function ClientsFilterBar({
  clientsData,
  setFilteredClients,
  onNewClient,
  pageSize = 10,
  onPageSizeChange,
  showAllClients = true,
  onShowAllChange,
}) {
  const [searchName, setSearchName] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [showAll, setShowAll] = useState(showAllClients);

  // Check if any filters are applied
  const filtersApplied =
    searchName || selectedService || startDate || endDate || selectedCity;

  useEffect(() => {
    let filtered = clientsData;

    if (searchName) {
      filtered = filtered.filter((client) =>
        `${client.first_name} ${client.last_name}`
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
    }

    if (selectedService) {
      filtered = filtered.filter((client) =>
        client.client_services?.some(
          (service) =>
            service.services?.name === selectedService || // if joined with service
            service.type === selectedService // if editing
        )
      );
    }

    if (startDate) {
      filtered = filtered.filter((client) =>
        client.client_services?.some(
          (service) => new Date(service.start_date) >= new Date(startDate)
        )
      );
    }

    if (endDate) {
      filtered = filtered.filter((client) =>
        client.client_services?.some(
          (service) => new Date(service.end_date) <= new Date(endDate)
        )
      );
    }

    if (selectedCity) {
      filtered = filtered.filter((client) =>
        client.city?.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    setFilteredClients(filtered);
  }, [
    searchName,
    selectedService,
    startDate,
    endDate,
    selectedCity,
    clientsData,
  ]);

  // Clearing all of the filters
  const clearFilters = () => {
    setSearchName('');
    setSelectedService('');
    setStartDate('');
    setEndDate('');
    setSelectedCity('');
  };

  // Get unique cities from clients data
  const getUniqueCities = () => {
    const cities = clientsData.map((client) => client.city).filter(Boolean);
    return [...new Set(cities)];
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setCurrentPageSize(newSize);
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  // Handle show all clients change
  const handleShowAllChange = (e) => {
    const showAllValue = e.target.value === 'true';
    setShowAll(showAllValue);
    if (onShowAllChange) {
      onShowAllChange(showAllValue);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4 items-center">
      {/* New Client Button */}
      <button
        onClick={onNewClient}
        className="bg-blue-500 hover:bg-primaryhover text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md"
      >
        Naujas Klientas
      </button>

      {/* Filter by name */}
      <input
        type="text"
        placeholder="Kliento Vardas"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        className="border p-2 rounded-lg shadow-md text-sm hover:bg-gray-50"
      />

      {/* Filter by service */}
      <select
        value={selectedService}
        onChange={(e) => setSelectedService(e.target.value)}
        className="border p-2 rounded-lg shadow-md text-sm bg-white hover:bg-gray-50"
      >
        <option value="">Turima paslauga</option>
        <option value="Internetas">Internetas</option>
        <option value="IPTV">IPTV</option>
      </select>

      {/* Filter by service start date */}
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="yyyy-MM-dd"
        locale="lt"
        className="border p-2 rounded-lg shadow-md text-sm hover:bg-gray-50"
        placeholderText="Pasirinkite pradžios datą"
      />

      {/* Filter by service end date */}
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        dateFormat="yyyy-MM-dd"
        locale="lt"
        className="border p-2 rounded-lg shadow-md text-sm hover:bg-gray-50"
        placeholderText="Pasirinkite pabaigos datą"
      />

      {/* Filter by city */}
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        className="border p-2 rounded-lg shadow-md text-sm bg-white hover:bg-gray-50"
      >
        <option value="">Miestas</option>
        {getUniqueCities().map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      {/* Clients amount that being shown */}
      <select
        value={currentPageSize}
        onChange={handlePageSizeChange}
        className="border p-2 rounded-lg shadow-md text-sm bg-white hover:bg-gray-50"
      >
        <option value="5">5 klientai</option>
        <option value="10">10 klientų</option>
        <option value="25">25 klientai</option>
        <option value="50">50 klientų</option>
        <option value="100">100 klientų</option>
      </select>

      {/* TODO: Later on this option may be available only for the Admin, if customer list is huge */}
      {/* Show all or only assigned */}
      <select
        value={showAll.toString()}
        onChange={handleShowAllChange}
        className="border p-2 rounded-lg shadow-md text-sm bg-white hover:bg-gray-50"
      >
        <option value="false">Mano klientai</option>
        <option value="true">Visi klientai</option>
      </select>

      {/* Remove filters */}
      <button
        onClick={clearFilters}
        className={`border p-2 rounded-lg text-sm font-semibold rounded-lg shadow-md ${
          filtersApplied ? 'bg-danger text-white' : ''
        }`}
      >
        Pašalinti Filtrus
      </button>
    </div>
  );
}
