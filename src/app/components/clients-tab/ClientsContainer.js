'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientsFilterBar from './ClientsFilterBar';
import ClientsTable from './ClientsTable';
import ClientModal from '../clients-tab/ClientModal';
import Pagination from './Pagination';
import {
  addClient,
  updateClient,
} from '@/src/services/supabase/client/clients';
import { getClientsAndServicesForUserClient } from '@/src/services/supabase/client/clients';
import toast from 'react-hot-toast';

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
  function getChangedFields(original, updated) {
    const changes = {};
    for (const key in updated) {
      if (updated[key] !== original[key] && !Array.isArray(updated[key])) {
        changes[key] = updated[key];
      }
    }
    return changes;
  }

  // Handle client save + toast
  const handleSaveClient = async (clientData, mode) => {
    // New client client creation mode
    if (mode === 'create') {
      try {
        //Addind the client to the database
        const { data, error } = await addClient(clientData);
        if (error) throw error;

        // refetch all clients from Supabase after adding
        const updated = await getClientsAndServicesForUserClient(
          true,
          pagination.page,
          pagination.pageSize
        );
        setFilteredClients(updated.clients);
        setPagination((prev) => ({
          ...prev,
          totalCount: updated.totalCount,
        }));
        //Displaying success/error message
        toast.success('Naujas klientas sukurtas!');
      } catch (err) {
        console.error('Error adding client:', err);
        toast.error('Nepavyko pridėti kliento.');
      }
    }
    if (mode === 'edit') {
      const { id, client_services, ...restOfForm } = clientData;

      // Compare with original objerct
      const clientChanges = getChangedFields(selectedClient, restOfForm);

      if (Object.keys(clientChanges).length > 0) {
        try {
          const { error } = await updateClient(id, clientChanges);
          if (error) throw error;
          // refetch all clients from Supabase after adding
          const updated = await getClientsAndServicesForUserClient(
            true,
            pagination.page,
            pagination.pageSize
          );
          setFilteredClients(updated.clients);
          setPagination((prev) => ({
            ...prev,
            totalCount: updated.totalCount,
          }));
          toast.success('Kliento informacija atnaujinta!');
        } catch (err) {
          console.error('Failed to update client:', err);
          toast.error('Nepavyko atnaujinti kliento.');
        }
      }
      const { data, error } = await updateClient(id, clientChanges);
      console.log('Updated data:', data); // debug
    }
    // 🔜 handle client_services changes here (add/edit/delete)
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
