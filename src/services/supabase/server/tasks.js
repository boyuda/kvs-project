import { createClient } from '@/utils/supabase/server';

export async function getTasksForUser(
  showAll = false,
  page = 1,
  pageSize = 10
) {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error getting user:', userError);
    return { tasks: [], totalCount: 0 };
  }

  // First get count
  let countQuery = supabase.from('tasks').select('id', { count: 'exact' });

  // If not showing all, filter by logged-in user
  if (!showAll) {
    countQuery = countQuery.eq('assigned_user_id', user.id);
  }

  const { count, error: countError } = await countQuery;

  if (countError) {
    console.error('Error counting tasks:', countError);
    return { tasks: [], totalCount: 0 };
  }

  // Calculate the offset for pagination
  const offset = (page - 1) * pageSize;

  //
  // Returns data in the following format, to avoid future sql calls
  // id: 'b1be6a6d-0e1e-4844-8ee9-0ac943a60018',
  // title: 'Domina paslaugos',
  // description: 'Klientas nori įsigyti IPTV',
  // due_date: '2025-04-30',
  // created_at: '2025-04-08T15:17:47.510042+00:00',
  // client_id: '42e0533f-d9c6-4d01-8ee1-d7fb3e715a2f',
  // assigned_user_id: 'c3373a01-fbc4-46fb-b56b-25db10bd4ee3',
  // status_id: 'be3848f2-486e-4544-a6b0-da80927c5bfd',
  // type_id: '07fe0613-eaea-4159-bb27-40ebb706b7e0',
  // clients: { last_name: 'Bartuševičiūtė', first_name: 'Agnė' },
  // users: { name: 'Dmitrijus', last_name: 'Byckovas' },
  // task_statuses: { name: 'Atviras', slug: 'open' },
  // task_types: { name: 'Skambutis', slug: 'call' }
  //
  // Build the query dynamically
  let query = supabase
    .from('tasks')
    .select(
      `
      id, title, description, due_date, created_at,
      client_id(id, first_name, last_name),
      assigned_user_id (id, name, last_name ),
      status_id,
      task_statuses (id, name, slug ),
      task_types (id, name, slug )
    `
    )
    .range(offset, offset + pageSize - 1)
    .order('due_date', { ascending: true });

  if (!showAll) {
    query = query.eq('assigned_user_id', user.id);
  }

  const { data: tasks, error } = await query;

  if (error) {
    console.error('Error fetching tasks: ', error);
    return { tasks: [], totalCount: 0 };
  }

  return { tasks, totalCount: count };
}
