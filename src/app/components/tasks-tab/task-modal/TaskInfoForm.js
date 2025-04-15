import {
  UserGroupIcon,
  PencilSquareIcon,
  ClockIcon,
  CalendarDaysIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon,
  UserIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const statusColors = {
  open: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-200 text-gray-800',
};

const statusDotColors = {
  open: 'bg-green-500',
  in_progress: 'bg-yellow-500',
  closed: 'bg-red-500',
  cancelled: 'bg-gray-400',
};

const iconStyle = 'h-5 w-5 text-gray-500';

export default function TaskInfoForm({
  task,
  formData,
  onChange,
  mode,
  allUsers,
  taskTypes,
  taskStatuses,
}) {
  // Null check
  if ((mode === 'edit' || mode === 'create') && !formData) return null;

  // Extracting slug for the coloring
  const statusSlug = task?.task_statuses.slug;
  const statusColorClass =
    statusColors[statusSlug] || 'bg-gray-100 text-gray-800';
  const dotColorClass = statusDotColors[statusSlug] || 'bg-gray-400';

  // If View
  if (mode === 'view') {
    return (
      <div className="text-sm flex flex-col gap-2">
        <h3 className="font-semibold">Užduoties Informacija</h3>

        {/* Title */}
        <div className="flex items-center gap-3">
          <PencilSquareIcon className={iconStyle} />
          <p className="font-semibold">{task.title}</p>
        </div>

        {/* Client Name */}
        <div className="flex items-center gap-3">
          <UserIcon className={iconStyle} />
          <p>
            Klientas - {task.client_id.first_name} {task.client_id.last_name}
          </p>
        </div>

        {/* Created at */}
        <div className="flex items-center gap-3">
          <ClockIcon className={iconStyle} />
          <div className="flex gap-1">
            <p>Užduotis sukurta</p>
            <p>{task.created_at.split('T')[0]}</p>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-3">
          <CalendarDaysIcon className={iconStyle} />
          <div className="flex gap-1">
            <p>Užduotis galioja iki</p>
            <p className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
              {task.due_date}
            </p>
          </div>
        </div>

        {/* Type */}
        <div className="flex items-center gap-3">
          <ClipboardDocumentIcon className={iconStyle} />
          <div className="flex gap-1">
            <p>Užduoties Tipas:</p>
            <p className="font-medium">{task.task_types.name}</p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          <ArrowPathIcon className={iconStyle} />
          <div className="flex gap-1 items-center">
            <p>Užduoties Statusas:</p>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColorClass}`}
            >
              <span className={`w-2 h-2 rounded-full ${dotColorClass}`}></span>
              {task.task_statuses.name}
            </span>
          </div>
        </div>

        {/* Assigned User */}
        <div className="flex items-center gap-3">
          <UserGroupIcon className={iconStyle} />
          <p>
            Užduotes vadybininkas {task.assigned_user_id.name}{' '}
            {task.assigned_user_id.last_name}
          </p>
        </div>

        {/* Task Description */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-1">
            <DocumentTextIcon className={iconStyle} />
            <h4 className="text-sm font-semibold">Užduoties Aprašymas</h4>
          </div>
          <div className="text-sm italic border border-gray-200 p-2 rounded-md bg-gray-50 whitespace-pre-wrap">
            {task.description || 'Nėra užduoties aprašymo'}
          </div>
        </div>
      </div>
    );
  }

  // If Edit
  if (mode === 'edit') {
    return (
      <div className="flex flex-col gap-2 text-sm">
        {/* Title */}
        <div className="flex items-center gap-1 mb-1">
          <label htmlFor="title" className="text-sm font-semibold">
            Užduoties Pavadinimas
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            maxLength={40}
            className={'flex-1 border rounded-lg p-2 text-sm border-gray-300'}
          />
        </div>
        {/* Due Date */}
        <div className="flex items-center gap-1 mb-1">
          <label htmlFor="due_date " className="text-sm font-semibold">
            Užduoties Atlikimo Terminas
          </label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={onChange}
            min={new Date().toISOString().split('T')[0]}
            className={'flex-1 border rounded-lg p-2 text-sm border-gray-300'}
          />
        </div>

        {/* Assigned User */}
        <div className="flex items-center gap-1 mb-1">
          <label htmlFor="assigned_user_id" className="text-sm font-semibold">
            Vadybininkas
          </label>
          <select
            id="assigned_user_id"
            name="assigned_user_id"
            value={formData.assigned_user_id || ''}
            onChange={onChange}
            className="flex-1 border rounded-lg p-2 text-sm border-gray-300"
            required
          >
            <option value="" disabled>
              Pasirinkite
            </option>
            {allUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} {user.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div className="flex items-center gap-1 mb-1">
          <label htmlFor="task_type_id" className="text-sm font-semibold">
            Užduoties Tipas
          </label>
          <select
            id="task_type_id"
            name="task_type_id"
            value={formData.task_type_id || ''}
            onChange={onChange}
            className="flex-1 border rounded-lg p-2 text-sm border-gray-300"
            required
          >
            <option value="" disabled>
              Pasirinkite
            </option>
            {taskTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1 mb-1">
          <label htmlFor="status_id" className="text-sm font-semibold">
            Užduoties Statusas
          </label>
          <select
            id="status_id"
            name="status_id"
            value={formData.status_id || ''}
            onChange={onChange}
            className="flex-1 border rounded-lg p-2 text-sm border-gray-300"
            required
          >
            <option value="" disabled>
              Pasirinkite
            </option>
            {taskStatuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="flex items-center gap-1 mb-1">
          <label htmlFor="description" className="text-sm font-semibold">
            Užduoties Aprašymas
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={onChange}
            maxLength={60}
            className={'flex-1 border rounded-lg p-2 text-sm border-gray-300'}
          />
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
