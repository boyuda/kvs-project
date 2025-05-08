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

// Used in Dashboard component
export async function getAssignedTasksSummary(userId) {
  const supabase = await createClient();

  // Get total tasks assigned
  const { count: total, error: totalError } = await supabase
    .from('tasks')
    .select('id', { count: 'exact' })
    .eq('assigned_user_id', userId);

  if (totalError) {
    console.error('Error fetching total tasks:', totalError);
    return { total: 0, upcoming: 0 };
  }

  // Count tasks due today
  const today = new Date().toISOString().split('T')[0];

  const { count: upcoming, error: upcomingError } = await supabase
    .from('tasks')
    .select('id', { count: 'exact' })
    .eq('assigned_user_id', userId)
    .eq('due_date', today);

  if (upcomingError) {
    console.error('Error fetching todays tasks:', upcomingError);
    return { total, upcoming: 0 };
  }

  return { total, upcoming };
}

export async function getUpcomingTasksForUser(userId, limit = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tasks')
    .select(
      `
    id,
    due_date,
    title,
    clients ( id, first_name, last_name ),
    task_statuses ( slug ),
    task_types ( name )
  `
    )
    .eq('assigned_user_id', userId)
    .order('due_date', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching upcoming tasks:', error);
    return [];
  }

  // Filter out closed statuses
  const filtered = data.filter((task) => task.task_statuses?.slug !== 'closed');

  return filtered.map((task) => ({
    clientID: task.clients?.id?.substring(0, 8),
    name: `${task.clients?.first_name ?? ''} ${task.clients?.last_name ?? ''}`,
    title: task.title,
    dueDate: task.due_date,
  }));
}
