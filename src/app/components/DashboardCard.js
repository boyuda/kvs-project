import {
  UsersIcon,
  ClipboardDocumentListIcon,
  CurrencyEuroIcon,
} from '@heroicons/react/24/outline';
import {
  getTotalAssignedClientsToUser,
  getExpiringContractsCount,
} from '@/src/services/supabase/server/clients';
import { getUserById } from '@/src/services/supabase/server/users';
import { getAssignedTasksSummary } from '@/src/services/supabase/server/tasks';

const ICONS = {
  tasks: ClipboardDocumentListIcon,
  clients: UsersIcon,
  sales: CurrencyEuroIcon,
};

export default async function DashboardCard({
  title,
  data,
  type,
  user,
  button,
}) {
  const Icon = ICONS[type];
  // Database calls
  const totalAssignedClients = await getTotalAssignedClientsToUser(user);
  const expiringContracts = await getExpiringContractsCount(user);
  const tasksSummary = await getAssignedTasksSummary(user);
  const [{ name }] = await getUserById(user);

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
                {tasksSummary.total === 1 && (
                  <>
                    Priskirta <strong>1</strong> užduotis.
                  </>
                )}
                {tasksSummary.total > 1 && tasksSummary.total < 10 && (
                  <>
                    Priskirtos <strong>{tasksSummary.total}</strong> užduotys.
                  </>
                )}
                {tasksSummary.total >= 10 && (
                  <>
                    Priskirta <strong>{tasksSummary.total}</strong> užduočių.
                  </>
                )}
              </span>
              <span className="text-sm">
                {tasksSummary.upcoming === 1 ? (
                  <>
                    <strong>1</strong> užduoties terminas baigiasi šiandien.
                  </>
                ) : (
                  <>
                    <strong>{tasksSummary.upcoming}</strong> užduočių terminai
                    baigiasi šiandien.
                  </>
                )}
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
      {type === 'general' && button && (
        <div className="flex justify-center items-center mt-4">{button}</div>
      )}
    </div>
  );
}
