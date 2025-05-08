import { createClient } from '@/utils/supabase/client';
export async function insertSale(sale) {
  const supabase = createClient();
  const { data, error } = await supabase.from('sales').insert(sale);
  if (error) {
    console.error('Insert sale failed:', error);
  }
  return { data, error };
}

//Fetch data of sales of current year
export async function getUserSalesByMonth(userId) {
  const supabase = createClient();

  const currentYear = new Date().getFullYear();
  const startOfYear = `${currentYear}-01-01`;
  const endOfYear = `${currentYear}-12-31`;

  const { data, error } = await supabase
    .from('sales')
    .select('sale_date, type')
    .eq('user_id', userId)
    .gte('sale_date', startOfYear)
    .lte('sale_date', endOfYear);

  if (error) {
    console.error('Error fetching sales:', error);
    return [];
  }

  const monthOrder = [
    'Sausis',
    'Vasaris',
    'Kovas',
    'Balandis',
    'Gegužė',
    'Birželis',
    'Liepa',
    'Rugpjūtis',
    'Rugsėjis',
    'Spalis',
    'Lapkritis',
    'Gruodis',
  ];

  // Initialize all months with 0s
  const salesByMonth = {};
  monthOrder.forEach((month) => {
    salesByMonth[month] = {
      name: month,
      sutarciu_pratesimai: 0,
      naujos_paslaugos: 0,
    };
  });

  // Populate with real data
  data.forEach((sale) => {
    const month = new Date(sale.sale_date)
      .toLocaleString('lt-LT', { month: 'long' })
      .toLowerCase();

    if (!salesByMonth[month]) return;

    if (sale.type === 'contract_renewal') {
      salesByMonth[month].sutarciu_pratesimai += 1;
    } else if (sale.type === 'new_service') {
      salesByMonth[month].naujos_paslaugos += 1;
    }
  });

  return monthOrder.map((m) => salesByMonth[m]);
}
