'use client';

import { useEffect, useState } from 'react';
import { getAllUsers } from '@/src/services/supabase/client/users';
import ReportsHeader from './ReportsHeader';
import ReportsFilterModal from './ReportsFilterModal';
import ManagerComparison from './ManagerComparison';
import SummaryCards from './SummaryCards';
import ReportsCharts from './ReportsCharts';
import LatestTasksTable from './LatestTasksTable';
import {
  exportClients,
  exportTasks,
} from '@/src/services/supabase/client/reports';
import { exportToExcel } from '@/src/utils/exportToExcel';
import toast from 'react-hot-toast';

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

  function getFullName(userId, allUsers) {
    const user = allUsers.find((u) => u.id === userId);
    return user ? `${user.name} ${user.last_name}` : 'Nenurodyta';
  }

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
      exportOptions: appliedFilters.exportOptions,
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

  const handleExport = async () => {
    if (!filters.exportOptions) return;

    try {
      const exportData = {};

      // TODO: Add similiar check for nulls as for tasks
      // Clients selection
      if (filters.exportOptions.clients) {
        const clientData = await exportClients(filters);
        if (clientData && clientData.length > 0) {
          exportData['Klientai'] = clientData.map((c) => ({
            Vardas: c.first_name,
            Pavardė: c.last_name,
            Miestas: c.city,
            'El. paštas': c.email,
            Telefonas: c.phone,
            Gatvė: c.street,
            'Nam. nr.': c.house_number,
            'Buto nr.': c.flat_number,
            'Priskirtas vadybininkas': getFullName(
              c.assigned_user_id,
              allUsers
            ),
            Pastabos: c.notes,
          }));
        }
      }

      // Tasks selection
      if (filters.exportOptions.tasks) {
        const taskData = await exportTasks(filters);
        if (taskData.length > 0) {
          exportData['Užduotys'] = taskData.map((t) => ({
            Pavadinimas: t.title,
            Aprašymas: t.description,
            Vadybininkas: `${t.users?.name ?? ''} ${t.users?.last_name ?? ''}`,
            Klientas: `${t.clients?.first_name ?? ''} ${
              t.clients?.last_name ?? ''
            }`,
            Tipas: t.task_types?.name ?? '',
            Statusas: t.task_statuses?.name ?? '',
            'Sukūrimo data': t.created_at
              ? new Date(t.created_at).toISOString().split('T')[0]
              : '',
            'Termino data': t.due_date ?? '',
            'Uždarymo data': t.close_date ?? '',
          }));
        }
      }
      if (Object.keys(exportData).length === 0) {
        toast.error('Nepavyko suformuoti ataskaitos!');
        return;
      }

      toast.success('Atsisiunčiama ataskaita!');
      exportToExcel(exportData);
    } catch (error) {
      console.error('Export error:', err);
      toast.error('Įvyko klaida eksportuojant duomenis');
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 min-h-screen">
      <ReportsHeader
        filters={filters}
        setFilters={setFilters}
        users={allUsers}
        onApplyFilters={() => setIsFilterOpen(true)}
        onExport={handleExport}
      />
      <ReportsFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        users={allUsers}
      />

      <SummaryCards filters={filters} />
      <ReportsCharts filters={filters} />
      <ManagerComparison filters={filters} />
      <LatestTasksTable filters={filters} />
    </div>
  );
}
