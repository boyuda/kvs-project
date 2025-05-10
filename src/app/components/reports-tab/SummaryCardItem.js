export default function SummaryCardItem({ label, value, sublabel, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border-2 p-4 flex flex-col justify-between min-h-[110px]">
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-texts">{label}</div>
        {icon && <div className="h-5 w-5 text-muted-foreground">{icon}</div>}
      </div>
      <div className="px-2 text-2xl font-bold text-foreground">{value}</div>
      {sublabel && (
        <div className="px-2 text-xs text-green-600 mt-1">{sublabel}</div>
      )}
    </div>
  );
}
