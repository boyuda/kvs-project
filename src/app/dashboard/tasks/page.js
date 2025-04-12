import TasksContainer from '@/src/app/components/tasks-tab/TasksContainer';
import { getTasksForUser } from '@/src/services/supabase/server/tasks';
import { createClient } from '@/utils/supabase/server';
import { getUserById } from '@/src/services/supabase/server/users';

export const metadata = {
  title: 'Užduotys',
};

export default async function TasksPage({ searchParams }) {
  // Get pagination parameters from URL
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const pageSize = searchParams?.pageSize
    ? parseInt(searchParams.pageSize)
    : 10;
  const showAll = searchParams?.showAll === 'true';

  // Get tasks for the user
  const tasks = await getTasksForUser(showAll, page, pageSize);

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
    <div className="p-4">
      <TasksContainer
        initialTasksData={tasks}
        currentPage={page}
        pageSize={pageSize}
        isAdmin={userProfile.is_admin || false}
      />
    </div>
  );
}
