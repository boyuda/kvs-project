import { WifiIcon, TvIcon } from '@heroicons/react/24/outline';
import { SERVICE_TYPES } from '@/src/utils/serviceHelpers';

export default function ServicesForm({
  services,
  onServiceChange,
  onAddService,
  onRemoveService,
  isViewMode,
  isAdmin,
}) {
  services = services || [];

  function renderEditView() {
    return (
      <div className="max-h-40 overflow-y-auto">
        {/* Labels at the top */}
        <div className="flex mb-2">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">
              Paslaugos tipas
            </label>
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">
              Pradžios data
            </label>
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">
              Pabaigos data
            </label>
          </div>
        </div>

        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-lg mb-1 flex items-center justify-between"
          >
            <div className="flex items-center w-full">
              <div className="flex flex-col md:flex-row md:space-x-6 w-full">
                <div className="flex-1">
                  <select
                    id={`service-type-${index}`}
                    value={
                      service.type || service.services?.name || 'Internetas'
                    }
                    onChange={(e) =>
                      onServiceChange(index, 'type', e.target.value)
                    }
                    className="w-full border rounded-lg p-2 text-sm"
                  >
                    {SERVICE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <input
                    type="date"
                    id={`start-date-${index}`}
                    value={service.start_date || ''}
                    onChange={(e) =>
                      onServiceChange(index, 'start_date', e.target.value)
                    }
                    className="w-full border rounded-lg p-2 text-sm"
                    required
                  />
                </div>

                <div className="flex-1">
                  <input
                    type="date"
                    id={`end-date-${index}`}
                    value={service.end_date || ''}
                    onChange={(e) =>
                      onServiceChange(index, 'end_date', e.target.value)
                    }
                    className="w-full border rounded-lg p-2 text-sm"
                    required
                  />
                </div>
              </div>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={() => onRemoveService(index)}
                className="text-red-500 ml-4"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    );
  }

  function renderReadOnlyView() {
    return (
      <div className="max-h-40 overflow-y-auto flex flex-col gap-3">
        {services.map((service, index) => {
          const isExpired =
            service.end_date && new Date(service.end_date) < new Date();
          return (
            <div key={index} className="text-sm">
              <div className="flex items-center gap-3">
                {service.services?.name === 'Internetas' ? (
                  <WifiIcon
                    className={`w-5 h-5 ${
                      isExpired ? 'stroke-danger' : 'stroke-secondary'
                    }`}
                  />
                ) : (
                  <TvIcon
                    className={`w-5 h-5 ${
                      isExpired ? 'stroke-danger' : 'stroke-secondary'
                    }`}
                  />
                )}
                <p>
                  {isExpired
                    ? 'Sutartis pasibaigė '
                    : 'Galiojanti sutartis iki '}
                  {service.end_date}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm">Turimos Paslaugos</h3>
        {!isViewMode && (
          <button
            type="button"
            onClick={onAddService}
            className="bg-blue-500 hover:bg-primaryhover text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            {services.length === 0
              ? 'Pridėti paslaugą'
              : 'Pridėti kitą paslaugą'}
          </button>
        )}
      </div>

      {services.length === 0 ? (
        <div className="text-center py-4 border border-dashed rounded-lg text-texts text-sm font-semibold">
          Klientas neturi jokių paslaugų.{' '}
          {!isViewMode && 'Pridėkite paslaugą paspaudę mygtuką aukščiau.'}
        </div>
      ) : isViewMode ? (
        renderReadOnlyView()
      ) : (
        renderEditView()
      )}
    </div>
  );
}
