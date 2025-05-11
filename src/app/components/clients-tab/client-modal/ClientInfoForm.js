import {
  UserCircleIcon,
  AtSymbolIcon,
  DevicePhoneMobileIcon,
  HomeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export default function ClientInfoForm({
  formData,
  onChange,
  isViewMode,
  isCreateMode = false,
  assignedUserName,
  allUsers = [],
}) {
  const fields = [
    { label: 'Vardas:', name: 'first_name', type: 'text', maxLength: 20 },
    { label: 'Pavardė:', name: 'last_name', type: 'text', maxLength: 20 },
    { label: 'El. Paštas:', name: 'email', type: 'email', maxLength: 35 },
    { label: 'Telefonas:', name: 'phone', type: 'text', maxLength: 12 },
    { label: 'Gatvė', name: 'street', type: 'text', maxLength: 20 },
    { label: 'Namo Nr.', name: 'house_number', type: 'text', maxLength: 4 },
    { label: 'Buto Nr.', name: 'flat_number', type: 'text', maxLength: 4 },
    { label: 'Miestas', name: 'city', type: 'text', maxLength: 20 },
  ];

  const iconStyle = 'h-5 w-5 text-gray-500';

  return isViewMode ? (
    <div className="text-sm flex flex-col gap-2">
      <h3 className="font-semibold">Kontaktai</h3>
      {/* Name */}
      <div className="flex items-center gap-3">
        <UserCircleIcon className={iconStyle} />
        <p className="font-semibold">
          {formData.first_name} {formData.last_name}
        </p>
      </div>
      {/* Email */}
      <div className="flex items-center gap-3">
        <AtSymbolIcon className={iconStyle} />
        <p>{formData.email}</p>
      </div>
      {/* Phone */}
      <div className="flex items-center gap-3">
        <DevicePhoneMobileIcon className={iconStyle} />
        <p>{formData.phone}</p>
      </div>
      {/* Address */}
      <div className="flex items-center gap-3">
        <HomeIcon className={iconStyle} />
        <p>
          {formData.street} {formData.house_number}
          {formData.flat_number ? `-${formData.flat_number}` : ''},{' '}
          {formData.city}
        </p>
      </div>
      {/* Assigned User */}
      <div className="flex items-center gap-3">
        <UserGroupIcon className={iconStyle} />
        <p>Vadybininkas: {assignedUserName || 'Įkeliama..'}</p>
      </div>
    </div>
  ) : (
    <div className="">
      {fields.map(({ label, name, type, maxLength }) => {
        const nameParts = name.split('.');
        const fieldValue = nameParts.reduce(
          (acc, part) => acc && acc[part],
          formData
        );

        return (
          <div key={name} className="flex items-center gap-1 mb-1">
            <label htmlFor={name} className="text-sm font-semibold w-[80px]">
              {label}
            </label>
            <input
              type={type}
              id={name}
              name={name}
              value={fieldValue || ''}
              onChange={onChange}
              disabled={isViewMode}
              maxLength={maxLength}
              className={'flex-1 border rounded-lg p-2 text-sm border-gray-300'}
              required={type !== 'text'}
            />
          </div>
        );
      })}
      {!isCreateMode && (
        <div className="flex items-center gap-1">
          <label
            htmlFor="assigned_user_id"
            className="text-sm font-semibold w-[80px]"
          >
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
      )}
    </div>
  );
}
