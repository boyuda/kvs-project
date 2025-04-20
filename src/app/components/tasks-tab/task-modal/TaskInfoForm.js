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
  onClientSearch,
  clientOptions,
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
        <h3 className="font-semibold text-gray-800">Užduoties Informacija</h3>

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
            <p>Tipas:</p>
            <p className="font-medium">{task.task_types.name}</p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          <ArrowPathIcon className={iconStyle} />
          <div className="flex gap-1 items-center">
            <p>Statusas:</p>
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
            Vadybininkas {task.assigned_user_id.name}{' '}
            {task.assigned_user_id.last_name}
          </p>
        </div>

        {/* Task Description */}
        <div className="text-sm flex flex-col gap-2 mt-4">
          <div className="flex items-center gap-2 mb-1">
            <DocumentTextIcon className={iconStyle} />
            <h3 className="text-sm font-semibold">Užduoties Aprašymas</h3>
          </div>
          <div className="text-xs p-2 border rounded-md whitespace-pre-wrap break-words">
            {task.description?.trim() || 'Nėra užduoties aprašymo'}
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
          <label htmlFor="title" className="text-sm font-semibold w-[100px]">
            Pavadinimas:
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
          <label
            htmlFor="due_date "
            className="text-sm font-semibold w-[100px]"
          >
            Terminas:
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
          <label
            htmlFor="assigned_user_id"
            className="text-sm font-semibold w-[100px]"
          >
            Vadybininkas:
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
          <label
            htmlFor="task_type_id"
            className="text-sm font-semibold w-[100px]"
          >
            Tipas:
          </label>
          <select
            id="type_id"
            name="type_id"
            value={formData.type_id || ''}
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
          <label
            htmlFor="status_id"
            className="text-sm font-semibold w-[100px]"
          >
            Statusas:
          </label>
          <select
            id="status_id"
            name="status_id"
            value={formData.status_id || ''}
            onChange={onChange}
            className="flex-1 border rounded-lg p-2 text-sm border-gray-300 "
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
        <div className="text-sm flex flex-col gap-2 mt-4">
          <h3 className="font-semibold">Užduoties Aprašymas</h3>
          <textarea
            className="w-full h-24 border shadow-sm border-gray-300 rounded-md p-2 max-h-24 overflow-y-auto resize-none text-xs"
            name="description"
            value={formData.description || ''}
            onChange={onChange}
            maxLength={150}
          />
          <p
            className={`text-xs text-right ${
              formData.description?.length > 130
                ? 'text-danger'
                : 'text-foreground'
            }`}
          >
            {formData.description?.length || 0}/150 simbolių
          </p>
        </div>
      </div>
    );
  }

  // If Create
  if (mode === 'create') {
    return (
      <div className="flex flex-col gap-2 text-sm">
        {/* Title */}
        <div className="flex items-center gap-1 mb-1">
          <label htmlFor="title" className="text-sm font-semibold w-[100px]">
            Pavadinimas:
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

        {/* Client */}
        <div className="flex items-center gap-1 mb-1 relative">
          <label
            htmlFor="client_name"
            className="text-sm font-semibold w-[100px]"
          >
            Klientas:
          </label>
          <div className="flex-1 relative">
            <input
              type="text"
              id="client_name"
              name="client_name"
              value={formData.client_name || ''}
              onChange={(e) => {
                if (!formData.client_id) {
                  onClientSearch(e.target.value);
                  onChange({
                    target: {
                      name: 'client_name',
                      value: e.target.value,
                    },
                  });
                }
              }}
              disabled={!!formData.client_id}
              placeholder="Ieškoti kliento..."
              className={`w-full border rounded-lg p-2 text-sm border-gray-300 ${
                formData.client_id ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />

            {formData.client_id && (
              <button
                type="button"
                onClick={() => {
                  onChange({ target: { name: 'client_id', value: '' } });
                  onChange({ target: { name: 'client_name', value: '' } });
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
              >
                ✕
              </button>
            )}

            {clientOptions?.length > 0 && (
              <ul className="absolute z-10 bg-white border mt-1 rounded-md shadow max-h-40 overflow-y-auto w-full text-sm shadow-sm border-gray-300 rounded-lg">
                {clientOptions.map((client) => (
                  <li
                    key={client.id}
                    onClick={() => {
                      onChange({
                        target: { name: 'client_id', value: client.id },
                      });
                      onChange({
                        target: {
                          name: 'client_name',
                          value: `${client.first_name} ${client.last_name}`,
                        },
                      });
                      // Hide dropdown if user selects the client
                      onClientSearch('');
                    }}
                    className="cursor-pointer hover:bg-gray-100 px-2 py-1"
                  >
                    {client.first_name} {client.last_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-1 mb-1">
          <label
            htmlFor="due_date "
            className="text-sm font-semibold w-[100px]"
          >
            Terminas:
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

        {/* Type */}
        <div className="flex items-center gap-1 mb-1">
          <label
            htmlFor="task_type_id"
            className="text-sm font-semibold w-[100px]"
          >
            Tipas:
          </label>
          <select
            id="type_id"
            name="type_id"
            value={formData.type_id || ''}
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
        {/* <div className="flex items-center gap-1 mb-1">
          <label
            htmlFor="status_id"
            className="text-sm font-semibold w-[100px]"
          >
            Statusas:
          </label>
          <select
            id="status_id"
            name="status_id"
            value={formData.status_id || ''}
            onChange={onChange}
            className="flex-1 border rounded-lg p-2 text-sm border-gray-300 "
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
        </div> */}

        {/* Description */}
        <div className="text-sm flex flex-col gap-2 mt-4">
          <h3 className="font-semibold">Užduoties Aprašymas</h3>
          <textarea
            className="w-full h-24 border shadow-sm border-gray-300 rounded-md p-2 max-h-24 overflow-y-auto resize-none text-xs"
            name="description"
            value={formData.description || ''}
            onChange={onChange}
            maxLength={150}
          />
          <p
            className={`text-xs text-right ${
              formData.description?.length > 130
                ? 'text-danger'
                : 'text-foreground'
            }`}
          >
            {formData.description?.length || 0}/150 simbolių
          </p>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
