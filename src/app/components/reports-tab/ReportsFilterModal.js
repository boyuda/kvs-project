import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';
import FilterFormLeft from './filter-sections/FilterFormLeft';
import FilterFormRight from './filter-sections/FilterFormRight';

export default function ReportsFilterModal({
  isOpen,
  onClose,
  onApply,
  users,
}) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [exportOptions, setExportOptions] = useState({
    clients: false,
    onlyWithoutServices: false,
  });

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const applyFilters = () => {
    const finalSelectedUsers =
      selectedUsers.length === 0 ? users.map((u) => u.id) : selectedUsers;

    const extraFilterApplied =
      finalSelectedUsers.length > 0 || dateRange.from || exportOptions.clients;

    onApply({
      selectedUsers: finalSelectedUsers,
      dateRange: { ...dateRange, label: 'custom' },
      exportOptions,
      extraFilterApplied,
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
        <DialogPanel className="bg-white rounded-lg p-6 w-full sm:max-w-2xl md:max-w-4xl 2xl:max-w-5xl mx-auto flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              Filtruoti ataskaitas
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FilterFormLeft
              users={users}
              selectedUsers={selectedUsers}
              toggleUser={toggleUser}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
            <FilterFormRight
              exportOptions={exportOptions}
              setExportOptions={setExportOptions}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={applyFilters}
              className="bg-blue-500 hover:bg-primaryhover text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md"
            >
              Taikyti
            </button>
            <button
              onClick={onClose}
              className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 hover:text-gray-800 transition-colors"
            >
              Atšaukti
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
