import { createClient } from '@/utils/supabase/server';

export async function getClientsAndServicesForUser(
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
    return { clients: null, totalCount: 0 };
  }

  // First get count
  let countQuery = supabase.from('clients').select('id', { count: 'exact' });

  // If not showing all, filter by logged-in user
  if (!showAll) {
    countQuery = countQuery.eq('assigned_user_id', user.id);
  }

  const { count, error: countError } = await countQuery;

  if (countError) {
    console.error('Error counting clients:', countError);
    return { clients: null, totalCount: 0 };
  }

  // Calculate the offset for pagination
  const offset = (page - 1) * pageSize;

  // Build the query dynamically
  let query = supabase
    .from('clients')
    .select(
      `
      id, first_name, last_name, email, phone, street, house_number, flat_number, city, assigned_user_id,
      client_services (
        id, start_date, end_date, service_id,
        services ( id, name )
      )
    `
    )
    .range(offset, offset + pageSize - 1); // Pagination

  // If not showing all, filter by logged-in user
  if (!showAll) {
    query = query.eq('assigned_user_id', user.id);
  }

  // Execute the query
  const { data: clients, error } = await query;

  if (error) {
    console.error('Error fetching clients and services:', error);
    return { clients: null, totalCount: 0 };
  }

  return { clients, totalCount: count };
}

export async function getTotalAssignedClientsToUser(userId) {
  const supabase = await createClient();

  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .eq('assigned_user_id', userId);

  return clients;
}

export async function getExpiringContractsCount(userId) {
  const supabase = await createClient();

  if (!userId) {
    console.error('assigned_user_id is required');
    return 0;
  }

  // Get the start and end dates of the current month
  const today = new Date();
  const firstDay = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1))
    .toISOString()
    .split('T')[0];
  const lastDay = new Date(
    Date.UTC(today.getFullYear(), today.getMonth() + 1, 0)
  )
    .toISOString()
    .split('T')[0];

  // Get all clients assigned to the user
  const { data: clients, error: clientError } = await supabase
    .from('clients')
    .select('id')
    .eq('assigned_user_id', userId);

  if (clientError) {
    console.error('Error fetching clients:', clientError);
    return 0;
  }

  if (!clients || clients.length === 0) {
    return 0; // No clients assigned to this user
  }

  const clientIds = clients.map((client) => client.id); // Extract client IDs

  // Ftch expiring contracts for those clients
  const { data: contracts, error: contractError } = await supabase
    .from('client_services')
    .select()
    .in('client_id', clientIds)
    .gte('end_date', firstDay)
    .lte('end_date', lastDay);

  if (contractError) {
    console.error('Error fetching expiring contracts:', contractError);
    return 0;
  }
  return contracts.length;
}
