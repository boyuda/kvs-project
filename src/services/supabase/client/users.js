import { createClient } from '@/utils/supabase/client';

// Get the name of the assigned user for a client
export async function getAssignedUserName(userId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select('name, last_name')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching assigned user name:', error);
    return null;
  }

  return `${data.name} ${data.last_name}`;
}

//Get names and last names of all users
export async function getAllUsers() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .select('id, name, last_name');

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data;
}

// Get the logged in user id
export async function getLoggedInUserId() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return user?.id || null;
}
