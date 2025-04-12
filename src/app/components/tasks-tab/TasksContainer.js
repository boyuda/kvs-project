'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '../clients-tab/Pagination';
import TasksTable from './TasksTable';

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

  const [filteredTasks, setFilteredTasks] = useState(
    initialTasksData?.tasks || []
  );

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

  const handleViewTask = (task) => {
    console.log('clicked');
    // setSelectedTask(task);
    // setModalMode('view');
    // setIsModalOpen(true);
  };

  return (
    <div>
      <h1>hello</h1>
      <TasksTable tasksData={filteredTasks} onTaskClick={handleViewTask} />
      <Pagination
        currentPage={pagination.page}
        pageSize={pagination.pageSize}
        totalCount={pagination.totalCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
