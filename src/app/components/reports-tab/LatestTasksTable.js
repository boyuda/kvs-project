import { useTaskModalStore } from '@/src/store/taskModalStore';

const statusColors = {
  open: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-200 text-gray-800',
};

export default function LatestTasksTable({ tasks }) {
  const handleTaskClick = (task) => {
    setTimeout(() => {
      openTaskModal(task, 'view');
    }, 100);
  };
  const { openTaskModal } = useTaskModalStore();

  return (
    <div className="overflow-x-auto border-2 rounded-xl">
      <h2 className="text-md font-semibold p-4">Naujausios užduotys</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-cards text-texts text-left">
            <th className="py-3 px-6 text-center">Pavadinimas</th>
            <th className="py-3 px-6 text-center">Tipas</th>
            <th className="py-3 px-6 text-center">Statusas</th>
            <th className="py-3 px-6 text-center">Priskirta</th>
            <th className="py-3 px-6 text-center">Terminas</th>
          </tr>
        </thead>
        <tbody>
          {tasks?.map((task) => (
            <tr
              key={task.id}
              className="border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                handleTaskClick(task.id);
                // Or use Zustand/modal logic to open task modal
              }}
            >
              <td className="py-3 px-6 text-center">{task.title}</td>
              <td className="py-3 px-6 text-center">{task.task_types?.name}</td>
              <td className="py-3 px-6 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[task.task_statuses?.slug] ||
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {task.task_statuses?.name}
                </span>
              </td>
              <td className="py-3 px-6 text-center">
                {task.users?.name} {task.users?.last_name}
              </td>
              <td className="py-3 px-6 text-center">{task.due_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
