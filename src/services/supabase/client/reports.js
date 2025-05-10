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

export async function getNewTasksCount(filters) {
  const supabase = createClient();

  const { from, to } = filters.dateRange;

  const { count, error } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .in('assigned_user_id', filters.selectedUsers)
    .gte('created_at', from)
    .lte('created_at', to);

  return count || 0;
}

export async function getNewSalesCount(filters) {
  const supabase = createClient();
  const { from, to } = filters.dateRange;

  const { data, error } = await supabase
    .from('sales')
    .select('type')
    .in('user_id', filters.selectedUsers)
    .gte('sale_date', from)
    .lte('sale_date', to);

  const newServices = data.filter((s) => s.type === 'new_service').length;
  const renewals = data.filter((s) => s.type === 'contract_renewal').length;

  return { newServices, renewals };
}

export async function getSalesAmountTotal(filters) {
  const supabase = createClient();
  const { from, to } = filters.dateRange;

  const { data, error } = await supabase
    .from('sales')
    .select('amount')
    .in('user_id', filters.selectedUsers)
    .gte('sale_date', from)
    .lte('sale_date', to);

  if (error) {
    console.error('Failed to fetch sales amount:', error);
    return 0;
  }

  const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
  return total;
}

export async function getClosedTasksCount(filters) {
  const supabase = createClient();
  const { from, to } = filters.dateRange;

  const { count, error } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .in('assigned_user_id', filters.selectedUsers)
    .gte('close_date', from)
    .lte('close_date', to);

  return count || 0;
}

export async function getServiceDistribution() {
  const supabase = createClient();

  // Step 1: Get all clients
  const { data: clients, error: clientError } = await supabase
    .from('clients')
    .select('id');

  if (clientError) {
    console.error('Error fetching clients:', clientError);
    return null;
  }

  // Step 2: Get all active client services
  const { data: services, error: serviceError } = await supabase
    .from('client_services')
    .select('client_id, services(name)')
    .eq('is_active', true);

  if (serviceError) {
    console.error('Error fetching services:', serviceError);
    return null;
  }

  const clientServiceMap = {};

  // Step 3: Build map of services per client
  services.forEach((entry) => {
    const clientId = entry.client_id;
    const serviceName = entry.services?.name?.toLowerCase();

    if (!clientServiceMap[clientId]) {
      clientServiceMap[clientId] = new Set();
    }

    if (serviceName) {
      clientServiceMap[clientId].add(serviceName);
    }
  });

  let internetOnly = 0;
  let iptvOnly = 0;
  let combined = 0;
  let noServices = 0;

  clients.forEach((client) => {
    const services = clientServiceMap[client.id];

    const hasInternet = services?.has('internetas');
    const hasIPTV = services?.has('iptv');

    if (!services || services.size === 0) {
      noServices++;
    } else if (hasInternet && hasIPTV) {
      combined++;
    } else if (hasInternet) {
      internetOnly++;
    } else if (hasIPTV) {
      iptvOnly++;
    }
  });

  return {
    internet: internetOnly,
    iptv: iptvOnly,
    combined,
    noServices,
  };
}
