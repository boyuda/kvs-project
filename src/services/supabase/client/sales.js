import { createClient } from '@/utils/supabase/client';
export async function insertSale(sale) {
  const supabase = createClient();
  const { data, error } = await supabase.from('sales').insert(sale);
  if (error) {
    console.error('Insert sale failed:', error);
  }
  return { data, error };
}
