import {
  UsersIcon,
  ClipboardDocumentListIcon,
  CurrencyEuroIcon,
} from '@heroicons/react/24/outline';
import {
  getTotalAssignedClientsToUser,
  getExpiringContractsCount,
} from '@/src/services/supabase/clients';
import { getUserById } from '@/src/services/supabase/users';

const ICONS = {
  tasks: ClipboardDocumentListIcon,
  clients: UsersIcon,
  sales: CurrencyEuroIcon,
};

export default async function DashboardCard({ title, data, type, user }) {
  const Icon = ICONS[type];
  // Database calls
  const totalAssignedClients = await getTotalAssignedClientsToUser(user);
  const expiringContracts = await getExpiringContractsCount(user);
  const [{ name }] = await getUserById(user);
  // console.log(expiringContracts);

  return (
    <div className="rounded-2xl p-4 flex-1 min-w-[130px] shadow-md border-2">
      {/* Title and Icon */}
      <div className="flex justify-between items-center">
        <span className="text-xs px-2 py-1 rounded-full font-semibold">
          {type === 'general' ? `${title}, ${name}!` : title}
        </span>
        {Icon && <Icon className="w-5 h-5 stroke-primary" />}
      </div>

      {/* Card Content */}
      {data && (
        <div className="text-texts flex flex-col font-normal px-2 mt-2 space-y-1">
          {type === 'tasks' && (
            <>
              <span className="text-sm">
                Priskirta <strong>{data.total}</strong> užduočių.
              </span>
              <span className="text-sm">
                <strong>{data.upcoming}</strong> užduočių terminas baigiasi
                šiandien.
              </span>
            </>
          )}
          {type === 'clients' && (
            <>
              <span className="text-sm">
                Viso priskirta <strong>{totalAssignedClients.length}</strong>
                {totalAssignedClients.length === 1 ? (
                  <span> klientas</span>
                ) : totalAssignedClients.length > 1 &&
                  totalAssignedClients.length < 10 ? (
                  <span> klientai</span>
                ) : (
                  <span> klientų</span>
                )}
              </span>
              <span className="text-sm">
                <strong>{expiringContracts}</strong>{' '}
                {expiringContracts > 1
                  ? 'klientų sutartys'
                  : 'kliento sutartis'}{' '}
                baigiasi šį mėnesį.
              </span>
            </>
          )}
          {type === 'sales' && (
            <>
              <span className="text-sm">
                <strong>{data.total}</strong> sutarčių atnaujinta.
              </span>
              <span className="text-sm">
                <strong>{data.completed}</strong> klientų užsakė naujas
                paslaugas.
              </span>
            </>
          )}
        </div>
      )}

      {/* General Card Type with Button */}
      {type === 'general' && (
        <div className="flex justify-center items-center mt-4">
          <button className="bg-blue-500 hover:bg-primaryhover text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md">
            Nauja užduotis
          </button>
        </div>
      )}
    </div>
  );
}
