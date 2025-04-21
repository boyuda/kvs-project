import ExportClientsSection from '../export-sections/ExportClientsSection';

export default function FilterFormRight({ exportOptions, setExportOptions }) {
  return (
    <div className="flex flex-col gap-6">
      <ExportClientsSection
        exportOptions={exportOptions}
        setExportOptions={setExportOptions}
      />
      {/* <ExportTasksSection ... /> */}
    </div>
  );
}
