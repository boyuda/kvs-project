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
