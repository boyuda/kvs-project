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
