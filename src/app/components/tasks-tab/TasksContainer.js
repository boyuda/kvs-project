'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '../clients-tab/Pagination';
import TasksTable from './TasksTable';
import TasksFilterBar from './TasksFilterBar';
import toast from 'react-hot-toast';
import { getTasksForUserClient } from '@/src/services/supabase/client/tasks';

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
  const [showAll, setShowAll] = useState(
    searchParams.get('showAll') === 'true' || false
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

  const handleNewTask = () => {
    console.log('new task');
    // setSelectedClient(null);
    // setModalMode('create');
    // setIsModalOpen(true);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('pageSize', newSize.toString());
    params.set('page', '1'); // Reset to first page when changing page size
    router.push(`?${params.toString()}`);

    setPagination((prev) => ({
      ...prev,
      pageSize: newSize,
      page: 1,
    }));

    // Refresh data with new page size
    // TODO:
    refreshTasks(1, newSize, showAll);
  };

  // Handle show all clients change
  const handleShowAllChange = (showAllTasks) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('showAll', showAllTasks.toString());
    params.set('page', '1'); // Reset to first page when changing filter
    router.push(`?${params.toString()}`);

    setShowAll(showAllTasks);

    // Refresh data with new filter
    // TODO:
    refreshTasks(1, pagination.pageSize, showAllTasks);
  };

  // Refresh list - extracted to a separate function to reuse
  const refreshTasks = async (
    page = pagination.page,
    size = pagination.pageSize,
    all = showAll
  ) => {
    try {
      const updated = await getTasksForUserClient(all, page, size);

      setFilteredTasks(updated.tasks);
      setPagination((prev) => ({
        ...prev,
        totalCount: updated.totalCount,
      }));

      return updated;
    } catch (error) {
      console.error('Error refreshing tasks:', error);
      toast.error('Nepavyko atnaujinti užduočių sąrašo');
      return null;
    }
  };

  return (
    <div>
      <TasksFilterBar
        tasksData={initialTasksData?.tasks || []}
        setFilteredTasks={setFilteredTasks}
        onNewTask={handleNewTask}
        pageSize={pagination.pageSize}
        onPageSizeChange={handlePageSizeChange}
        showAllTasks={showAll}
        onShowAllChange={handleShowAllChange}
      />
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
