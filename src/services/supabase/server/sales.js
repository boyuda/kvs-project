import { createClient } from '@/utils/supabase/server';

export async function getMonthlySalesSummary(userId) {
  const supabase = await createClient();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const startOfMonth = new Date(year, month, 1).toISOString().split('T')[0];
  const endOfMonth = new Date(year, month + 1, 0).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('sales')
    .select('type')
    .eq('user_id', userId)
    .gte('sale_date', startOfMonth)
    .lte('sale_date', endOfMonth);

  if (error) {
    console.error('Error fetching monthly sales:', error);
    return { renewals: 0, newServices: 0 };
  }

  const summary = {
    renewals: 0,
    newServices: 0,
  };

  data.forEach((sale) => {
    if (sale.type === 'contract_renewal') summary.renewals += 1;
    else if (sale.type === 'new_service') summary.newServices += 1;
  });

  return summary;
}
