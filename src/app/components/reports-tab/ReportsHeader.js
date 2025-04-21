'use client';

import {
  UsersIcon,
  CalendarDaysIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

export default function ReportsHeader({
  filters,
  setFilters,
  onApplyFilters,
  users,
  onExport,
}) {
  const datePresets = [
    { label: 'Šiandien', range: [new Date(), new Date()] },
    { label: 'Paskutinės 7 dienos', range: [subtractDays(7), new Date()] },
    { label: 'Paskutinės 14 dienų', range: [subtractDays(14), new Date()] },
    { label: 'Šis mėnuo', range: [startOfMonth(), new Date()] },
  ];

  const handleUserChange = (e) => {
    const selected = e.target.value;

    if (!selected || selected === '') {
      // Visi vadybininkai → select all
      const allUserIds = users.map((u) => u.id);
      setFilters((prev) => ({
        ...prev,
        selectedUsers: allUserIds,
      }));
    } else {
      // Single user or "Keli vadybininkai" doesn't come from this dropdown
      setFilters((prev) => ({
        ...prev,
        selectedUsers: [selected],
      }));
    }
  };

  const handleDateChange = (e) => {
    const selectedLabel = e.target.value;
    const preset = datePresets.find((p) => p.label === selectedLabel);

    if (preset) {
      const [from, to] = preset.range;
      setFilters((prev) => ({
        ...prev,
        dateRange: {
          from: from.toISOString().slice(0, 10),
          to: to.toISOString().slice(0, 10),
          label: selectedLabel,
        },
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ataskaitos</h1>
          <p className="text-gray-500">
            Paslaugų, užduočių ir klientų apžvalga
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* User */}
          <div className="relative">
            <select
              onChange={handleUserChange}
              value={
                filters.selectedUsers.length === 0 ||
                filters.selectedUsers.length === users.length
                  ? ''
                  : filters.selectedUsers.length === 1
                  ? filters.selectedUsers[0]
                  : 'multiple'
              }
              className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 shadow-md"
            >
              {/* Render Labels */}
              <option value="">
                {filters.selectedUsers.length === 0 ||
                filters.selectedUsers.length === users.length
                  ? 'Visi vadybininkai'
                  : filters.selectedUsers.length === 1
                  ? (() => {
                      const user = users.find(
                        (u) => u.id === filters.selectedUsers[0]
                      );
                      return user
                        ? `${user.name} ${user.last_name}`
                        : '1 vadybininkas';
                    })()
                  : 'Keli vadybininkai'}
              </option>

              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} {u.last_name}
                </option>
              ))}
            </select>
            <UsersIcon className="h-4 w-4 text-gray-700 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Date  */}
          <div className="relative">
            <select
              onChange={handleDateChange}
              value={filters.dateRange.label || 'Šiandien'}
              className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 shadow-md"
            >
              {/* If it's a custom range, display it */}
              {filters.dateRange?.label === 'custom' && (
                <option value="custom">{`${filters.dateRange.from} – ${filters.dateRange.to}`}</option>
              )}

              {datePresets.map((preset) => (
                <option key={preset.label} value={preset.label}>
                  {preset.label}
                </option>
              ))}
            </select>

            <CalendarDaysIcon className="h-4 w-4 text-gray-700 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filter Button */}
          <button
            onClick={onApplyFilters}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 shadow-md"
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            Filtruoti
          </button>

          {/* Export Button */}
          <button
            disabled={!filters.canExport}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white shadow-md ${
              filters.canExport
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            onClick={onExport}
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Eksportuoti
          </button>
        </div>
      </div>
    </div>
  );
}

function subtractDays(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}
function startOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}
