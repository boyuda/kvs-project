export default function FilterFormLeft({
  users,
  selectedUsers,
  toggleUser,
  dateRange,
  setDateRange,
}) {
  return (
    <div className="text-sm flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {users.map((user) => (
            <label key={user.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={selectedUsers.includes(user.id)}
                onChange={() => toggleUser(user.id)}
              />
              <p>
                {user.name} {user.last_name}
              </p>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-2">
          Pasirinkite laikotarpį
        </h3>
        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
            className="w-full border rounded-lg px-2 py-2 text-sm border-gray-300"
          />
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="w-full border rounded-lg px-2 py-2 text-sm border-gray-300"
          />
        </div>
      </div>
    </div>
  );
}
