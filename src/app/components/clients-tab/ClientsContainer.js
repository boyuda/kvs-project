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
  addService,
  updateService,
  deleteService,
} from '@/src/services/supabase/client/clients';
import { getClientsAndServicesForUserClient } from '@/src/services/supabase/client/clients';
import toast from 'react-hot-toast';
import { getServiceIdFromName } from '@/src/utils/serviceHelpers';

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
      // TODO: delete once full functionality is implemented
      const { data, error } = await updateClient(id, clientChanges);
      console.log('Updated data:', data); // debug
    }
    // 🔜 handle client_services changes here (add/edit/delete)
    // Services sync
    if (mode === 'edit') {
      const originalServices = selectedClient.client_services || [];
      const updatedServices = clientData.client_services || [];

      const servicesToAdd = updatedServices.filter((s) => !s.id); // No ID = new
      console.log('Updated data:', servicesToAdd);
      const servicesToUpdate = updatedServices.filter((s) =>
        originalServices.find(
          (o) =>
            o.id === s.id &&
            (o.start_date !== s.start_date ||
              o.end_date !== s.end_date ||
              o.services?.name !== s.services?.name)
        )
      );
      const servicesToDelete = originalServices.filter(
        (o) => !updatedServices.find((u) => u.id === o.id)
      );

      // ADD
      for (const newService of servicesToAdd) {
        await addService({
          client_id: clientData.id,
          service_id: getServiceIdFromName(newService.type), // you'll need this mapping
          start_date: newService.start_date,
          end_date: newService.end_date,
        });
      }

      // UPDATE
      for (const updated of servicesToUpdate) {
        await updateService(updated.id, {
          service_id: getServiceIdFromName(updated.type),
          start_date: updated.start_date,
          end_date: updated.end_date,
        });
      }

      // DELETE
      for (const deleted of servicesToDelete) {
        await deleteService(deleted.id);
      }
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
