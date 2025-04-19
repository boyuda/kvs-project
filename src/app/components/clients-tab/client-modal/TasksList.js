'use client';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const statusColors = {
  open: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-200 text-gray-800',
};

export default function TasksList({
  tasks = [],
  onTaskClick = () => {},
  onNewTask = () => {},
}) {
  return (
    <div className="text-sm flex flex-col gap-3 text-texts">
      {/* Section Title with Icon */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ClipboardDocumentListIcon className="h-4 w-4 text-gray-500" />
          <h3 className="font-semibold text-gray-800">Užduotys</h3>
        </div>
        <button
          className="font-semibold text-xl leading-none text-gray-600 hover:text-blue-500 transition"
          onClick={onNewTask}
          type="button"
        >
          +
        </button>
      </div>

      {/* Tasks List */}
      <ul className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
        {tasks.length === 0 ? (
          <li className="text-gray-500 italic text-xs px-2">Užduočių nėra</li>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              onClick={() => onTaskClick(task)}
              className="cursor-pointer hover:bg-gray-50 border border-gray-100 bg-white p-3 rounded-md shadow-sm grid grid-cols-[60%_20%_20%]"
            >
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium text-[13px] truncate">
                  {task.title}
                </span>
                <span className="text-gray-500 text-xs truncate">
                  {task.task_types?.name || 'Nenurodytas tipas'}
                </span>
              </div>
              <div className="flex items-center">
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    statusColors[task.task_statuses?.slug] ||
                    'bg-gray-100 text-gray-600'
                  }`}
                >
                  {task.task_statuses?.name || 'Nežinomas'}
                </span>
              </div>
              <div className="flex items-center justify-end">
                <span className="text-xs text-gray-500">{task.due_date}</span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
