export default function ClientsTable({ clientsData, onClientClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-2 text-xs">
        <thead>
          <tr className="bg-cards text-texts text-left">
            <th className="py-3 px-6 border-b text-center">Kliento ID</th>
            <th className="py-3 px-6 border-b text-center">Vardas Pavardė</th>
            <th className="py-3 px-6 border-b text-center">El. Paštas</th>
            <th className="py-3 px-6 border-b text-center">Telefonas</th>
            <th className="py-3 px-6 border-b text-center">Adresas</th>
            <th className="py-3 px-6 border-b text-center">Miestas</th>
            <th className="py-3 px-6 border-b text-center">Paslaugos</th>
            <th className="py-3 px-6 border-b text-center">
              Sutarties Pradžia
            </th>
            <th className="py-3 px-6 border-b text-center">
              Sutarties Pabaiga
            </th>
          </tr>
        </thead>
        <tbody className="text-center">
          {clientsData.map((client, index) => {
            const services = client.client_services || [];
            const activeServices = services.filter((s) => s.is_active);

            return (
              <tr
                key={index}
                onClick={() => onClientClick(client)}
                className="border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="py-3 px-6">{client.id.substring(0, 8)}</td>
                <td className="py-3 px-6">
                  {client.first_name} {client.last_name}
                </td>
                <td className="py-3 px-6">{client.email}</td>
                <td className="py-3 px-6">{client.phone}</td>
                <td className="py-3 px-6">
                  {client.street} {client.house_number}
                  {client.flat_number ? `-${client.flat_number}` : ''}
                </td>
                <td className="py-3 px-6">{client.city}</td>

                {/* Services */}
                <td className="py-3 px-6">
                  {activeServices.length > 0 ? (
                    activeServices.map((s, idx) => (
                      <div key={idx} className="mb-1">
                        {s.services?.name || 'Nežinoma paslauga'}
                      </div>
                    ))
                  ) : (
                    <span className="text-red-500 font-bold">×</span>
                  )}
                </td>

                {/* Start Dates */}
                <td className="py-3 px-6">
                  {activeServices.length > 0 ? (
                    activeServices.map((s, idx) => (
                      <div key={idx} className="mb-1">
                        {s.start_date}
                      </div>
                    ))
                  ) : (
                    <span className="text-red-500 font-bold">–</span>
                  )}
                </td>

                {/* End Dates */}
                <td className="py-3 px-6">
                  {activeServices.length > 0 ? (
                    activeServices.map((s, idx) => {
                      const isExpired = new Date(s.end_date) < new Date();
                      return (
                        <div
                          key={idx}
                          className={`mb-1 ${
                            isExpired
                              ? 'text-danger animate-pulse font-semibold'
                              : ''
                          }`}
                        >
                          {s.end_date}
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-red-500 font-bold">–</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
