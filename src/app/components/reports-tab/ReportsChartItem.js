export default function ReportsChartItem({ title, children }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow border">
      <h2 className="text-md font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}
