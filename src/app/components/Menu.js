// 'use client';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { logout } from '../auth/sign-in/actions';
import {
  UsersIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  ArrowLeftStartOnRectangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export default async function Menu() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="my-4 text-sm">
      {/* Main Menu */}
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard/overview"
          className="flex items-center justify-center lg:justify-start gap-4 py-2 text-texts font-medium hover:bg-cards rounded-lg pl-0 lg:px-4"
        >
          <HomeIcon className="h-5 w-5" />
          <span className="hidden lg:block">Apžvalga</span>
        </Link>

        <Link
          href="/dashboard/tasks"
          className="flex items-center justify-center lg:justify-start gap-4 py-2 text-texts font-medium hover:bg-cards rounded-lg pl-0 lg:px-4"
        >
          <ClipboardDocumentListIcon className="h-5 w-5" />
          <span className="hidden lg:block">Užduotys</span>
        </Link>

        <Link
          href="/dashboard/clients"
          className="flex items-center justify-center lg:justify-start gap-4 py-2 text-texts font-medium hover:bg-cards rounded-lg pl-0 lg:px-4"
        >
          <UsersIcon className="h-5 w-5" />
          <span className="hidden lg:block">Klientai</span>
        </Link>

        <Link
          href="/dashboard/reports"
          className="flex items-center justify-center lg:justify-start gap-4 py-2 text-texts font-medium hover:bg-cards rounded-lg pl-0 lg:px-4"
        >
          <ChartBarIcon className="h-5 w-5" />
          <span className="hidden lg:block">Ataskaitos</span>
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center justify-center lg:justify-start gap-4 py-2 text-texts font-medium hover:bg-cards rounded-lg pl-0 lg:px-4"
          >
            <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
            <span className="hidden lg:block">Atsijungti</span>
          </button>
        </form>
      </div>
    </div>
  );
}
