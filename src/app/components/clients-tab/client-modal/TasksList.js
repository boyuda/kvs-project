'use client';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const statusColors = {
  atviras: 'bg-green-100 text-green-800',
  vykdoma: 'bg-yellow-100 text-yellow-800',
  uzdaryta: 'bg-red-100 text-red-800',
  atsaukta: 'bg-gray-200 text-gray-800',
};

export default function TasksList() {
  return (
    <div className="text-sm flex flex-col gap-3 text-texts">
      {/* Section Title with Icon */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ClipboardDocumentListIcon className="h-4 w-4 text-gray-500" />
          <h3 className="font-semibold text-gray-800">Užduotys</h3>
        </div>
        <button className="font-semibold text-xl leading-none text-gray-600 hover:text-blue-500 transition">
          +
        </button>
      </div>

      {/* Tasks List */}
      <ul className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
        {/* Generate 8 items */}
        {[...Array(8)].map((_, i) => (
          <li
            key={i}
            className="cursor-pointer hover:bg-gray-50 border border-gray-100 bg-white p-3 rounded-md shadow-sm grid grid-cols-[60%_20%_20%] "
          >
            <div className="flex flex-col overflow-hidden">
              <span className="font-medium text-[13px] truncate">
                Paskambinti ryte
              </span>
              <span className="text-gray-500 text-xs truncate">
                Nauja paslauga
              </span>
            </div>
            <div className="flex items-center">
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors.vykdoma}`}
              >
                Vykdoma
              </span>
            </div>
            <div className="flex items-center justify-end">
              <span className="text-xs text-gray-500">2025-04-15</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
