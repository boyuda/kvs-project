export default function TasksTable({ tasksData, onTaskClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-2 text-xs">
        <thead>
          <tr className="bg-cards text-texts text-left">
            <th className="py-3 px-6 border-b text-center">Užduoties ID</th>
            <th className="py-3 px-6 border-b text-center">Klientas</th>
            <th className="py-3 px-6 border-b text-center">Pavadinimas</th>
            <th className="py-3 px-6 border-b text-center">Statusas</th>
            <th className="py-3 px-6 border-b text-center">Tipas</th>
            <th className="py-3 px-6 border-b text-center">
              Priskirtas Vadybininkas
            </th>
            <th className="py-3 px-6 border-b text-center">Užduotis Sukurta</th>
            <th className="py-3 px-6 border-b text-center">
              Užduoties Terminas
            </th>
          </tr>
        </thead>
        <tbody className="text-center">
          {tasksData.map((task, index) => (
            <tr
              onClick={() => onTaskClick(task)}
              key={index}
              className="border-b hover:bg-gray-50"
            >
              <td className="py-3 px-6">{task.id.substring(0, 8)}</td>
              <td className="py-3 px-6">
                {task.client_id.first_name} {task.client_id.last_name}
              </td>
              <td className="py-3 px-6">{task.title}</td>
              <td className="py-3 px-6">{task.task_statuses.name}</td>
              <td className="py-3 px-6">{task.task_types.name}</td>
              <td className="py-3 px-6">{task.assigned_user_id.name}</td>
              <td className="py-3 px-6">{task.created_at.split('T')[0]}</td>
              <td className="py-3 px-6">
                <span
                  className={
                    new Date(task.due_date) < new Date()
                      ? 'text-danger animate-pulse font-semibold'
                      : ''
                  }
                >
                  {task.due_date}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
