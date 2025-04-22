'use client';

import { useEffect, useState } from 'react';
import {
  getTaskTypes,
  getTaskStatuses,
} from '@/src/services/supabase/client/tasks';

export default function ExportTasksSection({
  exportOptions,
  setExportOptions,
}) {
  const [types, setTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const typesData = await getTaskTypes();
      const statusesData = await getTaskStatuses();
      setTypes(typesData);
      setStatuses(statusesData);
    }
    fetchData();
  }, []);

  const handleToggle = (key, value) => {
    setExportOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div>
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            checked={exportOptions.tasks}
            onChange={(e) =>
              setExportOptions((prev) => ({
                ...prev,
                tasks: e.target.checked,
                ...(e.target.checked
                  ? {}
                  : {
                      taskStatus: '',
                      taskType: '',
                      withoutTasks: false,
                    }),
              }))
            }
          />
          Įtraukti užduočių duomenis
        </label>

        {exportOptions.tasks && (
          <div className="pl-4 space-y-2 text-sm">
            {/* Status */}
            <div className="flex items-center gap-2">
              <label className=" text-gray-700">Statusas</label>
              <select
                value={exportOptions.taskStatus || ''}
                onChange={(e) => handleToggle('taskStatus', e.target.value)}
                className=" border border-gray-300 rounded-lg px-2 py-1"
              >
                <option value="">Visi</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.slug}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Type */}
            <div className="flex items-center gap-2">
              <label className=" text-gray-700">Tipas</label>
              <select
                value={exportOptions.taskType || ''}
                onChange={(e) => handleToggle('taskType', e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1"
              >
                <option value="">Visi</option>
                {types.map((type) => (
                  <option key={type.id} value={type.slug}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Close Date  */}
            <div className="flex items-center gap-2">
              <label className=" text-gray-700 whitespace-nowrap">
                Uždarymo data
              </label>
              <input
                type="date"
                value={exportOptions.closeDateFrom || ''}
                onChange={(e) => handleToggle('closeDateFrom', e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1"
              />
              <span>-</span>
              <input
                type="date"
                value={exportOptions.closeDateTo || ''}
                onChange={(e) => handleToggle('closeDateTo', e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
