const CustomerTable = ({ title, data, columns }) => {
  return (
    <div className="overflow-x-auto border-2 rounded-xl">
      <h2 className="text-md font-semibold p-4">{title}</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-cards text-texts text-left">
            <th className="py-3 px-6 border-b text-center">Nr</th>
            {columns.map((col) => (
              <th key={col.key} className="py-3 px-6 border-b text-center">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-3 px-6 text-center">{index + 1}</td>
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-6 text-center">
                  {col.key === 'contractEndDate' || col.key === 'dueDate' ? (
                    <span
                      className={
                        new Date(row[col.key]) < new Date()
                          ? 'text-danger  animate-pulse'
                          : ''
                      }
                    >
                      {row[col.key] || '—'}
                    </span>
                  ) : (
                    row[col.key] || '—'
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
