Ok so here's my code so far for tasks:
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
<div>
<TasksContainer
initialTasksData={tasks}
currentPage={page}
pageSize={pageSize}
isAdmin={userProfile.is_admin || false}
/>
</div>
);
}

'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '../clients-tab/Pagination';

export default function TasksContainer({
initialTasksData,
currentPage,
pageSize,
isAdmin,
}) {
const router = useRouter();
const searchParams = useSearchParams();

const currentPageFromParams = parseInt(searchParams.get('page')) || 1;

const [pagination, setPagination] = useState({
page: currentPageFromParams,
pageSize: parseInt(searchParams.get('pageSize')) || pageSize,
totalCount: initialTasksData?.totalCount || 0,
});

// Handle page change
const handlePageChange = (newPage) => {
const params = new URLSearchParams(searchParams.toString());
params.set('page', newPage.toString());
router.push(`?${params.toString()}`);

    // Update the pagination state directly after changing the page
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));

};

return (
<div>
<h1>hello</h1>
<Pagination
        currentPage={pagination.page}
        pageSize={pagination.pageSize}
        totalCount={pagination.totalCount}
        onPageChange={handlePageChange}
      />
</div>
);
}

function TasksFilterBar() {
return <div></div>;
}

export default TasksFilterBar;

we probably need to create similiar code for filter as we did in client section, but we may change a little bit:

1. Instead of filter by name we can do filter by task
2. Instead of filter by service, we can filter (dropdown) by Status
3. Also filter by task type
4. For dates filter we can use creation date of task and task due date.
5. We can skip city
6. Instead of show Cities (as in Clients) we can display Tasks how many to display
