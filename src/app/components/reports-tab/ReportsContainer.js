'use client';

import { useEffect, useState } from 'react';
import { getAllUsers } from '@/src/services/supabase/client/users';
import ReportsHeader from './ReportsHeader';
import ReportsFilterModal from './ReportsFilterModal';
import ManagerComparison from './ManagerComparison';
import SummaryCards from './SummaryCards';
import ReportsCharts from './ReportsCharts';
import LatestTasksTable from './LatestTasksTable';

export default function ReportsContainer() {
  const [filters, setFilters] = useState({
    selectedUsers: [],
    dateRange: {
      from: new Date().toISOString().slice(0, 10),
      to: new Date().toISOString().slice(0, 10),
    },
    canExport: false,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const users = await getAllUsers();
      setAllUsers(users);

      // Set initial filter to include all users
      setFilters((prev) => ({
        ...prev,
        selectedUsers: users.map((u) => u.id),
      }));
    }

    fetchUsers();
  }, []);

  const handleApplyFilters = (appliedFilters) => {
    const onlySimpleFilters =
      appliedFilters.selectedUsers.length || appliedFilters.dateRange?.from;

    // Check if dateRange is empty – if so, reuse existing one
    const finalDateRange =
      appliedFilters.dateRange?.from && appliedFilters.dateRange?.to
        ? { ...appliedFilters.dateRange, label: 'custom' }
        : filters.dateRange;

    setFilters({
      ...filters,
      selectedUsers: appliedFilters.selectedUsers,
      dateRange: finalDateRange,
      canExport: !onlySimpleFilters
        ? false
        : !!appliedFilters.extraFilterApplied,
    });

    setIsFilterOpen(false);
    console.log('Applied filters:', {
      selectedUsers: appliedFilters.selectedUsers,
      dateRange: finalDateRange,
      extraFilterApplied: appliedFilters.extraFilterApplied,
    });
  };

  return (
    <div className="p-4">
      <ReportsHeader
        filters={filters}
        setFilters={setFilters}
        users={allUsers}
        onApplyFilters={() => setIsFilterOpen(true)}
      />
      <ReportsFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        users={allUsers}
      />
      <ManagerComparison filters={filters} />
      <SummaryCards filters={filters} />
      <ReportsCharts filters={filters} />
      <LatestTasksTable filters={filters} />
    </div>
  );
}
