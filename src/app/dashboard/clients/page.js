// import ClientsContainer from '@/src/app/components/clients-tab/ClientsContainer';
// import { getClientsAndServicesForUser } from '@/src/services/supabase/server/clients';
// import { createClient } from '@/utils/supabase/server';
// import { getUserById } from '@/src/services/supabase/server/users';

// export const metadata = {
//   title: 'Klientai',
// };

// export default async function ClientsPage({ searchParams }) {
//   // Get pagination parameters from URL
//   const page = searchParams?.page ? parseInt(searchParams.page) : 1;
//   const pageSize = searchParams?.pageSize
//     ? parseInt(searchParams.pageSize)
//     : 10;
//   // Get total count of clients
//   const clients = await getClientsAndServicesForUser(true, page, pageSize);

//   // Supabase to get the authenticated user
//   const supabase = await createClient();

//   // Get the authenticated user
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     redirect('/auth/sign-in');
//   }

//   // Get user data
//   const [userProfile] = await getUserById(user.id);

//   return (
//     <div className="">
//       <div className="p-4">
//         <ClientsContainer
//           initialClientsData={clients}
//           currentPage={page}
//           pageSize={pageSize}
//           isAdmin={userProfile.is_admin || false}
//         />
//       </div>
//     </div>
//   );
// }

import ClientsContainer from '@/src/app/components/clients-tab/ClientsContainer';
import { getClientsAndServicesForUser } from '@/src/services/supabase/server/clients';
import { createClient } from '@/utils/supabase/server';
import { getUserById } from '@/src/services/supabase/server/users';

export const metadata = {
  title: 'Klientai',
};

export default async function ClientsPage({ searchParams }) {
  // Get pagination parameters from URL
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const pageSize = searchParams?.pageSize
    ? parseInt(searchParams.pageSize)
    : 10;
  const showAll = searchParams?.showAll === 'true';

  // Get total count of clients
  const clients = await getClientsAndServicesForUser(showAll, page, pageSize);

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
    <div className="">
      <div className="p-4">
        <ClientsContainer
          initialClientsData={clients}
          currentPage={page}
          pageSize={pageSize}
          isAdmin={userProfile.is_admin || false}
        />
      </div>
    </div>
  );
}
