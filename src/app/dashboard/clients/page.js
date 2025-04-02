import ClientsContainer from '@/src/app/components/clients-tab/ClientsContainer';
import { getClientsAndServicesForUser } from '@/src/services/supabase/clients';

export const metadata = {
  title: 'Klientai',
};

export default async function ClientsPage({ searchParams }) {
  // Get pagination parameters from URL
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const pageSize = searchParams?.pageSize
    ? parseInt(searchParams.pageSize)
    : 10;
  // Get total count of clients
  const clients = await getClientsAndServicesForUser(true, page, pageSize);

  return (
    <div className="">
      <div className="p-4">
        <ClientsContainer
          initialClientsData={clients}
          currentPage={page}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
