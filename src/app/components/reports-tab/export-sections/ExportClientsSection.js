export default function ExportClientsSection({
  exportOptions,
  setExportOptions,
}) {
  return (
    <div>
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            checked={exportOptions.clients}
            onChange={(e) =>
              setExportOptions((prev) => ({
                ...prev,
                clients: e.target.checked,
                ...(e.target.checked ? {} : { onlyWithoutServices: false }),
              }))
            }
          />
          Įtraukti klientų duomenis
        </label>

        {exportOptions.clients && (
          <label className="flex items-center gap-2 pl-4 text-sm">
            <input
              type="checkbox"
              checked={exportOptions.onlyWithoutServices}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              onChange={(e) =>
                setExportOptions((prev) => ({
                  ...prev,
                  onlyWithoutServices: e.target.checked,
                }))
              }
            />
            Tik klientai be paslaugų
          </label>
        )}
      </div>
    </div>
  );
}
