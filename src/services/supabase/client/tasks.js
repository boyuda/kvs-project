import { createClient } from '@/utils/supabase/client';

// Get all the tasks
export async function getTasksForUserClient(
  showAll = false,
  page = 1,
  pageSize = 10
) {
  const supabase = createClient();

  // Get the authenticated session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  const user = session?.user;

  if (sessionError || !user) {
    console.error('User not authenticated:', sessionError);
    return { tasks: [], totalCount: 0 };
  }

  // Get total task count
  let countQuery = supabase.from('tasks').select('id', { count: 'exact' });

  if (!showAll) {
    countQuery = countQuery.eq('assigned_user_id', user.id);
  }

  const { count, error: countError } = await countQuery;

  if (countError) {
    console.error('Error counting tasks:', countError);
    return { tasks: [], totalCount: 0 };
  }

  const offset = (page - 1) * pageSize;

  // Fetch task data with nested relationships
  let query = supabase
    .from('tasks')
    .select(
      `
      id, title, description, due_date, created_at,
      client_id(id, first_name, last_name),
      assigned_user_id(id, name, last_name),
      status_id,
      task_statuses(id, name, slug),
      task_types(id, name, slug)
    `
    )
    .range(offset, offset + pageSize - 1)
    .order('due_date', { ascending: true });

  if (!showAll) {
    query = query.eq('assigned_user_id', user.id);
  }

  const { data: tasks, error } = await query;

  if (error) {
    console.error('Error fetching tasks:', error);
    return { tasks: [], totalCount: 0 };
  }

  return { tasks, totalCount: count };
}

// Fetch all the comments
export async function getCommentsForTask(taskId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('task_comments')
    .select('comment, created_at, users(name, last_name)')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }
  return data;
}

// Function to push new comment
export async function addCommentToTask(taskId, userId, comment) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('task_comments')
    .insert([{ task_id: taskId, user_id: userId, comment }]);

  if (error) throw error;
  return data;
}

// Fetch all tasks for the particular client
export async function getTasksForClient(clientId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tasks')
    .select(
      `
      id, title, description, due_date, created_at,
      client_id(id, first_name, last_name),
      assigned_user_id(id, name, last_name),
      status_id,
      task_statuses(id, name, slug),
      task_types(id, name, slug)
    `
    )
    .eq('client_id', clientId)
    .order('due_date', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

// Get all task types
export async function getTaskTypes() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('task_types')
    .select('id, name, slug');

  if (error) {
    console.error('Error fetching task types:', error);
    return [];
  }

  return data;
}

// Get all task statuses
export async function getTaskStatuses() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('task_statuses')
    .select('id, name, slug');

  if (error) {
    console.error('Error fetching task statuses:', error);
    return [];
  }

  return data;
}

// Update task
export async function updateTask(taskId, updates) {
  const supabase = createClient();

  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId);

  return { error };
}

// Fetch particular task for rendering after the task gets updated.
export async function getTaskById(id) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tasks')
    .select(
      `
      *,
      assigned_user_id:users ( id, name, last_name ),
      task_statuses ( id, name, slug ),
      task_types ( id, name, slug ),
      client_id:clients ( id, first_name, last_name )
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching task:', error);
    return null;
  }

  return data;
}

// Insert task into Tasks table
export const createTask = async (newTaskData) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tasks')
    .insert([newTaskData])
    .select()
    .single();

  return { data, error };
};
