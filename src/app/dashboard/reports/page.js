import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getUserById } from '@/src/services/supabase/server/users';

export const metadata = {
  title: 'Ataskaitos',
};

export default async function ReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  const [userProfile] = await getUserById(user.id);

  if (!userProfile.is_admin) {
    redirect('/dashboard');
  }
  return <h1>Reports</h1>;
}
