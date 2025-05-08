import DashboardCard from '@/src/app/components/DashboardCard';
import BarChartComponent from '@/src/app/components/BarChart';
import CustomerTable from '@/src/app/components/CustomerTable';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import NewTaskButton from '../../components/overview-tab/NewTaskButton';

export const metadata = {
  title: 'Apžvalga',
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  return (
    <div className="flex flex-col gap-6 p-4 min-h-screen">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Panel - Dashboard Cards */}
        <div className="w-full lg:w-2/4 flex flex-col">
          <div className="grid grid-cols-2 gap-6 flex-grow">
            <DashboardCard
              type="general"
              title="Sveikas atvykęs"
              user={user.id}
              button={<NewTaskButton />}
            />
            <DashboardCard
              type="tasks"
              title="Užduočių apžvalga"
              user={user.id}
            />

            <DashboardCard
              type="clients"
              title="Klientų apžvalga"
              user={user.id}
            />

            <DashboardCard
              type="sales"
              title="Mėnesio pardavimų apžvalga"
              user={user.id}
            />
          </div>
        </div>

        {/* Right Panel - Chart */}
        <div className="w-full lg:w-2/4">
          <BarChartComponent userId={user.id} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Table */}
        <div className="w-full lg:w-2/4">
          <CustomerTable title="Recent Customers" />
        </div>

        {/* Right Table */}
        <div className="w-full lg:w-2/4">
          <CustomerTable title="Top Customers" />
        </div>
      </div>
    </div>
  );
}
