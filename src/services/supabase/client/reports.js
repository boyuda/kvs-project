import { createClient } from '@/utils/supabase/client';

export async function exportClients(filters) {
  const supabase = createClient();
  const { selectedUsers, exportOptions } = filters;

  if (!exportOptions.clients) return [];

  const query = supabase
    .from('clients')
    .select('*, client_services(id)')
    .in('assigned_user_id', selectedUsers);

  if (exportOptions.onlyWithoutServices) {
    query.is('client_services', null);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Export error:', error);
    return [];
  }

  return data;
}

export async function exportTasks(filters) {
  const supabase = createClient();

  let query = supabase
    .from('tasks')
    .select(
      `
      id, title, description, created_at, due_date, close_date,
      clients ( first_name, last_name, city ),
      users:assigned_user_id ( name, last_name ),
      task_statuses!status_id ( name ),
      task_types!type_id ( name )
      `
    )
    .in('assigned_user_id', filters.selectedUsers);

  // Filter by task type
  if (filters.exportOptions.taskType) {
    const { data: typeData, error: typeError } = await supabase
      .from('task_types')
      .select('id')
      .eq('slug', filters.exportOptions.taskType)
      .single();

    if (typeError || !typeData) {
      console.warn(
        'Task type not found for slug:',
        filters.exportOptions.taskType
      );
      return [];
    }

    query = query.eq('type_id', typeData.id);
  }

  // Filter by task status
  if (filters.exportOptions.taskStatus) {
    const { data: statusData, error: statusError } = await supabase
      .from('task_statuses')
      .select('id')
      .eq('slug', filters.exportOptions.taskStatus)
      .single();

    if (statusError || !statusData) {
      console.warn(
        'Task status not found for slug:',
        filters.exportOptions.taskStatus
      );
      return [];
    }

    query = query.eq('status_id', statusData.id);
  }

  // Filter by date
  if (filters.exportOptions.closeDateFrom) {
    query = query.gte('close_date', filters.exportOptions.closeDateFrom);
  }

  if (filters.exportOptions.closeDateTo) {
    query = query.lte('close_date', filters.exportOptions.closeDateTo);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error exporting tasks:', error);
    return [];
  }

  return data || [];
}
