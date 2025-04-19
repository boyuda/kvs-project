export default function ConditionalSalesFields({ selectedType }) {
  return (
    <div className="mt-4 p-4 border rounded-md bg-blue-50 text-blue-800 text-sm">
      <p>
        Pasirinktas užduoties tipas: <strong>{selectedType}</strong>
      </p>
    </div>
  );
}
