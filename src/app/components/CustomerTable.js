import React from 'react';

const customers = [
  {
    id: 1,
    clientID: 38328,
    name: 'John Doe',
    service: 'Internetas',
    contractEndDate: '2023-12-31',
  },
  {
    id: 2,
    clientID: 34244,
    name: 'Jane Smith',
    service: 'IPTV',
    contractEndDate: '2024-06-30',
  },
  {
    id: 3,
    clientID: 45191,
    name: 'Alice Johnson',
    service: 'Internetas',
    contractEndDate: '2023-11-15',
  },
  {
    id: 4,
    clientID: 41234,
    name: 'Alice Johnson',
    service: 'Internetas',
    contractEndDate: '2023-11-15',
  },
  {
    id: 5,
    clientID: 41241,
    name: 'Alice Johnson',
    service: 'IPTV',
    contractEndDate: '2023-11-15',
  },
  {
    id: 6,
    clientID: 23232,
    name: 'Alice Johnson',
    service: 'IPTV',
    contractEndDate: '2023-11-15',
  },
  {
    id: 7,
    clientID: 55512,
    name: 'Alice Johnson',
    service: 'IPTV',
    contractEndDate: '2023-11-15',
  },
  {
    id: 8,
    clientID: 94182,
    name: 'Alice Johnson',
    service: 'Internetas',
    contractEndDate: '2023-11-15',
  },
  {
    id: 9,
    clientID: 12349,
    name: 'Alice Johnson',
    service: 'Internetas',
    contractEndDate: '2023-11-15',
  },
  {
    id: 10,
    clientID: 45151,
    name: 'Alice Johnson',
    service: 'Internetas',
    contractEndDate: '2023-11-15',
  },
];

const CustomerTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-2 text-sm ">
        <thead>
          <tr className="bg-cards text-texts text-left">
            <th className="py-3 px-6 border-b">Nr</th>
            <th className="py-3 px-6 border-b">Kliento ID</th>
            <th className="py-3 px-6 border-b">Kliento Vardas</th>
            <th className="py-3 px-6 border-b">Turima paslauga</th>
            <th className="py-3 px-6 border-b">Sutarties pabaiga</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-3 px-6">{customer.id}</td>
              <td className="py-3 px-6">{customer.clientID}</td>
              <td className="py-3 px-6">{customer.name}</td>
              <td className="py-3 px-6">{customer.service}</td>
              <td className="py-3 px-6">{customer.contractEndDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
