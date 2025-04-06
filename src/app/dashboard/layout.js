import Link from 'next/link';
import Menu from '../components/Menu';
import Navbar from '../components/Navbar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getUserById } from '@/src/services/supabase/server/users';

export default async function DashboardLayout({ children }) {
  // Supabase to get the authenticated user
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  // Get user data
  const [userProfile] = await getUserById(user.id);

  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]  border-r-2 outline-cards">
        <Link href="/dashboard" className="justify-center flex p-4">
          <span className=" hidden lg:block text-primary font-semibold text-">
            Klientų valdymo sistema
          </span>
        </Link>
        <Menu isAdmin={userProfile.is_admin || false} />
      </div>
      {/* RIGHT*/}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] overflow-scroll no-scrollbar ">
        <Navbar user={user.id} />
        {children}
      </div>
    </div>
  );
}
