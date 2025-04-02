import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';
import { getUserById } from '@/src/services/supabase/users';

// TODO: SIGN OUT BUTTON
export default async function Navbar({ user }) {
  const [{ name, last_name, is_admin }] = await getUserById(user);

  return (
    <div className="flex items-center justify-between p-4">
      {/* Search Bar */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] px-2 ring-cards">
        <MagnifyingGlassIcon className="h-5 w-5" />
        <input
          type="text"
          placeholder="Ieškoti kliento.."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>
      {/* Icons and user */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="rounded-full w-7 h-7 flex items-center justify-center bg-cards">
          <BellIcon className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 text-texts font-medium">
            {name} {last_name}
          </span>
          <span className="text-[10px] text-texts text-right">
            {is_admin ? 'Administratorius' : 'Vartotojas'}
          </span>
        </div>
      </div>
    </div>
  );
}
