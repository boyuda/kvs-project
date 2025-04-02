import Link from 'next/link';
import Menu from '../components/Menu';
import Navbar from '../components/Navbar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]  border-r-2 outline-cards">
        <Link href="/dashboard" className="justify-center flex p-4">
          <span className=" hidden lg:block text-primary font-medium text-">
            Klientų valdymo sistema
          </span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT*/}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] overflow-scroll no-scrollbar ">
        <Navbar user={user.id} />
        {children}
      </div>
    </div>
  );
}
