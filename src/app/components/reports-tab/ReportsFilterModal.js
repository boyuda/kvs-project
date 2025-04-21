'use client';

import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

export default function ReportsFilterModal({
  isOpen,
  onClose,
  onApply,
  users,
}) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const applyFilters = () => {
    // If no user is selected, select all and return to visi vadybinkai
    const finalSelectedUsers =
      selectedUsers.length === 0 ? users.map((u) => u.id) : selectedUsers;

    const extraFilterApplied = finalSelectedUsers.length > 0 || dateRange.from;

    onApply({
      selectedUsers: finalSelectedUsers,
      dateRange: {
        ...dateRange,
        label: 'custom',
      },
      extraFilterApplied,
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white rounded-md p-6 w-full max-w-lg shadow-md">
          <DialogTitle className="text-lg font-semibold mb-4">
            Filtruoti ataskaitas
          </DialogTitle>

          <div className="mb-4">
            <p className="font-medium mb-2">Pasirinkite vadybininkus:</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {users.map((user) => (
                <label key={user.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUser(user.id)}
                  />
                  {user.name} {user.last_name}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="font-medium mb-2">Pasirinkite laikotarpį:</p>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                className="border rounded px-2 py-1 w-full"
              />
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
                className="border rounded px-2 py-1 w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600"
            >
              Atšaukti
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Taikyti
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
