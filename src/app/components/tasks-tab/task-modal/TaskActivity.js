'use client';

function TaskActivity() {
  const mockActivities = [
    {
      id: '1',
      users: { name: 'Andrius', last_name: 'Berlinskas' },
      message: 'Sukūrė užduotį „Domina paslaugos“',
      created_at: '2025-04-08T15:17:47.510Z',
    },
    {
      id: '2',
      users: { name: 'Jurgita', last_name: 'Lasauskienė' },
      message: 'Pakeitė statusą į „Vykdoma“',
      created_at: '2025-04-10T10:00:00.000Z',
    },
    {
      id: '3',
      users: { name: 'Andrius', last_name: 'Berlinskas' },
      message: 'Pridėjo komentarą: Susisiekta su klientu.',
      created_at: '2025-04-12T09:20:00.000Z',
    },
  ];

  return (
    <div>
      <p>Text</p>
    </div>
  );
}

export default TaskActivity;
