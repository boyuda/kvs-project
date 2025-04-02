export default function ClientsTable({ clientsData, onClientClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-2 text-xs">
        <thead>
          <tr className="bg-cards text-texts text-left">
            <th className="py-3 px-6 border-b">Kliento ID</th>
            <th className="py-3 px-6 border-b">Vardas Pavardė</th>
            <th className="py-3 px-6 border-b">El. Paštas</th>
            <th className="py-3 px-6 border-b">Telefonas</th>
            <th className="py-3 px-6 border-b">Adresas</th>
            <th className="py-3 px-6 border-b">Miestas</th>
            <th className="py-3 px-6 border-b">Paslaugos</th>
            <th className="py-3 px-6 border-b">Sutarties Pradžia</th>
            <th className="py-3 px-6 border-b">Sutarties Pabaiga</th>
          </tr>
        </thead>
        <tbody>
          {clientsData.map((client, index) => (
            <tr
              onClick={() => onClientClick(client)}
              key={index}
              className="border-b hover:bg-gray-50"
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
              <td className="py-3 px-6">
                {client.client_services.map((service, idx) => (
                  <div key={idx} className="mb-1">
                    {service.service_id ===
                    '532f4c0e-99cd-4c25-a78e-991dc19870eb'
                      ? 'Internetas'
                      : 'IPTV'}
                  </div>
                ))}
              </td>
              <td className="py-3 px-6">
                {client.client_services.map((service, idx) => (
                  <div key={idx} className="mb-1">
                    {service.start_date}
                  </div>
                ))}
              </td>
              <td className="py-3 px-6">
                {client.client_services.map((service, idx) => (
                  <div key={idx} className="mb-1">
                    {service.end_date}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
