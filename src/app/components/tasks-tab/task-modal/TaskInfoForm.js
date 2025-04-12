import {
  UserGroupIcon,
  PencilSquareIcon,
  ClockIcon,
  CalendarDaysIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon,
  UserIcon,
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

export default function TaskInfoForm({ isViewMode }) {
  return isViewMode ? (
    <div className="text-sm flex flex-col gap-2">
      <h3 className="font-semibold">Užduoties Informacija</h3>

      {/* Title */}
      <div className="flex items-center gap-3">
        <PencilSquareIcon className={iconStyle} />
        <p className="font-semibold">Domina Paslaugos</p>
      </div>

      {/* Client Name */}
      <div className="flex items-center gap-3">
        <UserIcon className={iconStyle} />
        <p>Klientas - Agnė Rušinskienė</p>
      </div>

      {/* Created at */}
      <div className="flex items-center gap-3">
        <ClockIcon className={iconStyle} />
        <div className="flex gap-1">
          <p>Užduotis sukurta</p>
          <p>2025-01-01</p>
        </div>
      </div>

      {/* Due Date */}
      <div className="flex items-center gap-3">
        <CalendarDaysIcon className={iconStyle} />
        <div className="flex gap-1">
          <p>Užduotis galioja iki</p>
          <p className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
            2025-04-30
          </p>
        </div>
      </div>

      {/* Type */}
      <div className="flex items-center gap-3">
        <ClipboardDocumentIcon className={iconStyle} />
        <div className="flex gap-1">
          <p>Užduoties Tipas:</p>
          <p className="font-medium">Nauja Paslauga</p>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        <ArrowPathIcon className={iconStyle} />
        <div className="flex gap-1 items-center">
          <p>Užduoties Statusas:</p>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColors.in_progress}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${statusDotColors.in_progress}`}
            ></span>
            Vykdoma
          </span>
        </div>
      </div>

      {/* Assigned User */}
      <div className="flex items-center gap-3">
        <UserGroupIcon className={iconStyle} />
        <p>Užduotį sukūrė Andrius Berlinskas</p>
      </div>
    </div>
  ) : (
    <div>
      <h1>hi</h1>
    </div>
  );
}
