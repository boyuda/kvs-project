import { createClient } from '@/utils/supabase/server';

export async function getUserById(userId) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId);

  return profile;
}
