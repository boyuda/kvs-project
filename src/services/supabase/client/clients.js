//
// Supabase calls for client rendering
import { createClient } from '@/utils/supabase/client';

export const addClient = async (clientData) => {
  const supabase = createClient();

  // 1. Get logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('User not authenticated:', userError);
    return { data: null, error: userError || new Error('Not authenticated') };
  }

  // 2. Extract and clean client data
  const { client_services, ...cleanData } = clientData;
  const clientToInsert = {
    ...cleanData,
    assigned_user_id: user.id,
  };

  // 3. Insert the client
  const { data: insertedClient, error: insertClientError } = await supabase
    .from('clients')
    .insert([clientToInsert])
    .select()
    .single();

  if (insertClientError) {
    console.error('Client insert error:', insertClientError);
    return { data: null, error: insertClientError };
  }

  // 4. Fetch all service IDs from Supabase
  const { data: availableServices, error: serviceFetchError } = await supabase
    .from('services')
    .select('id, name');

  if (serviceFetchError) {
    console.error('Failed to fetch services:', serviceFetchError);
    return { data: insertedClient, error: serviceFetchError };
  }

  // 5. Map user-provided service types to actual UUIDs
  if (Array.isArray(client_services) && client_services.length > 0) {
    const servicesToInsert = client_services
      .map((service) => {
        const matched = availableServices.find((s) => s.name === service.type);
        if (!matched) return null;

        return {
          client_id: insertedClient.id,
          service_id: matched.id,
          start_date: service.startDate,
          end_date: service.endDate,
        };
      })
      .filter(Boolean); // Remove nulls

    const { error: serviceInsertError } = await supabase
      .from('client_services')
      .insert(servicesToInsert);

    if (serviceInsertError) {
      console.error('Client services insert error:', serviceInsertError);
    }
  }

  return { data: insertedClient, error: null };
};

export async function getClientsAndServicesForUserClient(
  showAll = false,
  page = 1,
  pageSize = 10
) {
  const supabase = createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error getting user:', userError);
    return { clients: null, totalCount: 0 };
  }

  // Count query
  let countQuery = supabase.from('clients').select('id', { count: 'exact' });
  if (!showAll) {
    countQuery = countQuery.eq('assigned_user_id', user.id);
  }

  const { count, error: countError } = await countQuery;
  if (countError) {
    console.error('Error counting clients:', countError);
    return { clients: null, totalCount: 0 };
  }

  // Pagination offset
  const offset = (page - 1) * pageSize;

  // Fetch clients and their services
  let query = supabase
    .from('clients')
    .select(
      `
      id, first_name, last_name, email, phone, street, house_number, flat_number, city, notes, assigned_user_id,
      client_services (
        id, start_date, end_date, service_id,
        services ( id, name )
      )
    `
    )
    .range(offset, offset + pageSize - 1);

  if (!showAll) {
    query = query.eq('assigned_user_id', user.id);
  }

  const { data: clients, error } = await query;
  if (error) {
    console.error('Error fetching clients and services:', error);
    return { clients: null, totalCount: 0 };
  }

  return { clients, totalCount: count };
}
