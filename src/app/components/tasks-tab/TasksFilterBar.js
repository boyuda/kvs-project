'use client';
import { useEffect, useState } from 'react';

function TasksFilterBar({
  tasksData,
  setFilteredTasks,
  onNewTask,
  pageSize = 10,
  onPageSizeChange,
  showAllTasks = true,
  onShowAllChange,
}) {
  const [searchName, setSearchName] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [showAll, setShowAll] = useState(showAllTasks);

  // Check if any filters are applied
  const filtersApplied =
    searchName ||
    searchTitle ||
    selectedStatus ||
    selectedType ||
    startDate ||
    endDate;

  useEffect(() => {
    let filtered = tasksData;

    if (searchName) {
      filtered = filtered.filter((task) =>
        `${task.client_id.first_name} ${task.client_id.last_name}`
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
    }

    if (searchTitle) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(
        (task) => task.task_statuses.name === selectedStatus
      );
    }

    if (selectedType) {
      filtered = filtered.filter(
        (task) => task.task_types.name === selectedType
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (task) => new Date(task.created_at) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (task) => new Date(task.created_at) <= new Date(endDate)
      );
    }

    setFilteredTasks(filtered);
  }, [
    searchName,
    searchTitle,
    selectedStatus,
    selectedType,
    startDate,
    endDate,
    tasksData,
  ]);

  // Get unique statuses from tasks data
  const getUniqueStatuses = () => {
    const statuses = tasksData
      .map((task) => task.task_statuses.name)
      .filter(Boolean);
    return [...new Set(statuses)];
  };

  // Get unique types from tasks data
  const getUniqueTypes = () => {
    const types = tasksData.map((task) => task.task_types.name).filter(Boolean);
    return [...new Set(types)];
  };

  // Clearing all of the filters
  const clearFilters = () => {
    setSearchName('');
    setSearchTitle('');
    setSelectedStatus('');
    setSelectedType('');
    setStartDate('');
    setEndDate('');
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setCurrentPageSize(newSize);
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  // Handle show all tasks change
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
        onClick={onNewTask}
        className="bg-blue-500 hover:bg-primaryhover text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md"
      >
        Nauja Užduotis
      </button>

      {/* Filter by name */}
      <input
        type="text"
        placeholder="Kliento Vardas"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        className="border p-2 rounded-lg shadow-md text-sm"
      />

      {/* Filter by title */}
      <input
        type="text"
        placeholder="Užduoties pavadinimas"
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
        className="border p-2 rounded-lg shadow-md text-sm"
      />

      {/* Filter by status */}
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="border p-2 rounded-lg shadow-md text-sm bg-white"
      >
        <option value="">Statusas</option>
        {getUniqueStatuses().map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      {/* Filter by type */}
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedType(e.target.value)}
        className="border p-2 rounded-lg shadow-md text-sm bg-white"
      >
        <option value="">Tipas</option>
        {getUniqueTypes().map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {/* Filter by task start date */}
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border p-2 rounded-lg shadow-md text-sm"
      />

      {/* Filter by task end date */}
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border p-2 rounded-lg shadow-md text-sm"
      />

      {/* Tasks amount that being shown */}
      <select
        value={currentPageSize}
        onChange={handlePageSizeChange}
        className="border p-2 rounded-lg shadow-md text-sm bg-white"
      >
        <option value="5">5 užduotys</option>
        <option value="10">10 užduočių</option>
        <option value="25">25 užduotys</option>
        <option value="50">50 užduočių</option>
        <option value="100">100 užduočių</option>
      </select>

      {/* TODO: Later on this option may be available only for the Admin, if customer list is huge */}
      {/* Show all or only assigned */}
      <select
        value={showAll.toString()}
        onChange={handleShowAllChange}
        className="border p-2 rounded-lg shadow-md text-sm bg-white"
      >
        <option value="false">Mano užduotys</option>
        <option value="true">Visos užduotys</option>
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

export default TasksFilterBar;
