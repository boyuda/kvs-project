import ExportClientsSection from '../export-sections/ExportClientsSection';
import ExportTasksSection from '../export-sections/ExportTasksSection';

export default function FilterFormRight({ exportOptions, setExportOptions }) {
  return (
    <div className=" text-sm flex flex-col">
      {/* <div className="grid grid-cols-1 sm:grid-cols-2"> */}
      <div className="flex flex-col gap-4">
        <ExportClientsSection
          exportOptions={exportOptions}
          setExportOptions={setExportOptions}
        />
        <ExportTasksSection
          exportOptions={exportOptions}
          setExportOptions={setExportOptions}
        />
      </div>
    </div>
  );
}
