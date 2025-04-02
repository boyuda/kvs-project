'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientsFilterBar from './ClientsFilterBar';
import ClientsTable from './ClientsTable';
import ClientModal from '../clients-tab/ClientModal';
import Pagination from './Pagination'; // Create this component

export default function ClientsContainer({
  initialClientsData,
  currentPage = 1,
  pageSize = 10,
  totalCount = 0,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filteredClients, setFilteredClients] = useState(
    initialClientsData?.clients || []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const currentPageFromParams = parseInt(searchParams.get('page')) || 1;

  const [pagination, setPagination] = useState({
    page: currentPageFromParams,
    pageSize: pageSize,
    totalCount: initialClientsData?.totalCount || 0,
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

  const handleNewClient = () => {
    setSelectedClient(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleSaveClient = (clientData, mode) => {
    if (mode === 'create') {
      // Add a new client ID for new clients - in real app this would come from the backend
      const newClient = {
        ...clientData,
        clientID: Math.floor(Math.random() * 100000),
      };

      setFilteredClients((prev) => [newClient, ...prev]);
    } else {
      // Update existing client
      setFilteredClients((prev) =>
        prev.map((client) =>
          client.clientID === clientData.clientID ? clientData : client
        )
      );
    }
  };

  return (
    <>
      <ClientsFilterBar
        clientsData={initialClientsData?.clients || []}
        setFilteredClients={setFilteredClients}
        onNewClient={handleNewClient}
      />

      <ClientsTable
        clientsData={filteredClients}
        onClientClick={handleViewClient}
      />

      <Pagination
        currentPage={pagination.page}
        pageSize={pagination.pageSize}
        totalCount={pagination.totalCount}
        onPageChange={handlePageChange}
      />

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        client={selectedClient}
        initialMode={modalMode}
        onSave={handleSaveClient}
      />
    </>
  );
}
