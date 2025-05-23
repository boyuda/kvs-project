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

  // Get all clients
  const { data: clients, error: clientError } = await supabase
    .from('clients')
    .select('id');

  if (clientError) {
    console.error('Error fetching clients:', clientError);
    return null;
  }

  // SGet all active client services
  const { data: services, error: serviceError } = await supabase
    .from('client_services')
    .select('client_id, services(name)')
    .eq('is_active', true);

  if (serviceError) {
    console.error('Error fetching services:', serviceError);
    return null;
  }

  const clientServiceMap = {};

  // Build map of services per client
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

export async function getMonthlySalesTrends() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_monthly_sales');

  if (error) {
    console.error('Error fetching monthly sales:', error);
    return [];
  }

  return data;
}

export async function getTaskStatusDistribution() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tasks')
    .select('status_id, task_statuses(name, slug)', { count: 'exact' });

  if (error) {
    console.error('Error fetching task status distribution:', error);
    return [];
  }

  const statusCount = {};
  data.forEach((task) => {
    const slug = task.task_statuses?.slug;
    if (!slug) return;
    if (!statusCount[slug]) {
      statusCount[slug] = 1;
    } else {
      statusCount[slug]++;
    }
  });

  return Object.entries(statusCount).map(([slug, count]) => ({
    name:
      slug === 'open'
        ? 'Naujas'
        : slug === 'in_progress'
        ? 'Vykdomas'
        : slug === 'closed'
        ? 'Uždaryta'
        : 'Atšaukta',
    slug,
    value: count,
  }));
}

export async function getClientsByCity() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_clients_by_city');

  if (error) {
    console.error('Error fetching clients by city:', error);
    return [];
  }

  return data;
}

export async function getTaskResolutionTime() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_task_completion_times');

  if (error) {
    console.error('Error fetching task resolution time:', error);
    return [];
  }

  return data;
}

export async function getManagerSalesSummary() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_manager_sales_summary');

  if (error) {
    console.error('Error fetching manager sales summary:', error);
    return [];
  }

  return data;
}

export async function getLatestTasks() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tasks')
    .select(
      `
      id,
      title,
      due_date,
      users ( name, last_name ),
      task_types ( name ),
      task_statuses ( name, slug )
    `
    )
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching latest tasks:', error);
    return [];
  }

  return data;
}

export async function fetchTaskById(taskId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tasks')
    .select(
      `
      *,
      client_id:clients (id, first_name, last_name),
      assigned_user_id:users (id, name, last_name),
      task_types (id, name, slug),
      task_statuses (id, name, slug)
    `
    )
    .eq('id', taskId)
    .single();

  if (error) {
    console.error('Failed to fetch task:', error);
    return null;
  }

  return data;
}
