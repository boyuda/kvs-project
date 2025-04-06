'use client';

import { useState, useEffect } from 'react';
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
  isAdmin,
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
    pageSize: parseInt(searchParams.get('pageSize')) || pageSize,
    totalCount: initialClientsData?.totalCount || 0,
  });

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
    refreshClients(1, newSize, showAll);
  };

  // Handle show all clients change
  const handleShowAllChange = (showAllClients) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('showAll', showAllClients.toString());
    params.set('page', '1'); // Reset to first page when changing filter
    router.push(`?${params.toString()}`);

    setShowAll(showAllClients);

    // Refresh data with new filter
    refreshClients(1, pagination.pageSize, showAllClients);
  };

  // Refresh list - extracted to a separate function to reuse
  const refreshClients = async (
    page = pagination.page,
    size = pagination.pageSize,
    all = showAll
  ) => {
    try {
      const updated = await getClientsAndServicesForUserClient(all, page, size);

      setFilteredClients(updated.clients);
      setPagination((prev) => ({
        ...prev,
        totalCount: updated.totalCount,
      }));

      return updated;
    } catch (error) {
      console.error('Error refreshing clients:', error);
      toast.error('Nepavyko atnaujinti klientų sąrašo');
      return null;
    }
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

  // Handle client modal save
  const handleSaveClient = async (clientData, mode) => {
    let didUpdate = false;

    // New client client creation mode
    if (mode === 'create') {
      try {
        //Adding the client to the database
        const { error } = await addClient(clientData);
        if (error) throw error;
        //Flag change for refreshing at the end
        didUpdate = true;
        //Displaying success/error message
        toast.success('Naujas klientas sukurtas!');
      } catch (error) {
        console.error('Failed to create client:', error);
        toast.error('Nepavyko pridėti kliento.');
      }
    }
    // Edit mode - handle both client info and services
    else if (mode === 'edit') {
      // Handle client info updates
      const { id, client_services, ...restOfForm } = clientData;

      // Compare with original object
      const clientChanges = getChangedFields(selectedClient, restOfForm);

      // Only update client info if there are changes
      let clientInfoUpdated = false;
      if (Object.keys(clientChanges).length > 0) {
        try {
          const { error } = await updateClient(id, clientChanges);
          if (error) throw error;
          clientInfoUpdated = true;
          didUpdate = true;
          toast.success('Kliento informacija atnaujinta!');
        } catch (error) {
          console.error('Failed to update client:', error);
          toast.error('Nepavyko atnaujinti kliento.');
        }
      }

      // Handle service updates
      const originalServices = selectedClient.client_services || [];
      const updatedServices = clientData.client_services || [];

      const servicesToAdd = updatedServices.filter((s) => !s.id);
      const servicesToUpdate = updatedServices.filter((s) =>
        originalServices.find(
          (o) =>
            o.id === s.id &&
            (o.start_date !== s.start_date ||
              o.end_date !== s.end_date ||
              o.service_id !== getServiceIdFromName(s.type))
        )
      );
      const servicesToDelete = originalServices.filter(
        (o) => !updatedServices.find((u) => u.id === o.id)
      );

      // Only proceed with service operations if there are any changes
      const hasServiceChanges =
        servicesToAdd.length > 0 ||
        servicesToUpdate.length > 0 ||
        servicesToDelete.length > 0;

      if (hasServiceChanges) {
        let serviceUpdateSuccess = false;

        // Add new services
        for (const newService of servicesToAdd) {
          try {
            const { error } = await addService({
              client_id: clientData.id,
              service_id: getServiceIdFromName(newService.type),
              start_date: newService.start_date,
              end_date: newService.end_date,
            });
            if (error) throw error;
            serviceUpdateSuccess = true;
            didUpdate = true;
          } catch (error) {
            console.error('Failed to add service:', error);
            toast.error('Nepavyko pridėti paslaugos.');
          }
        }

        // Update existing services
        for (const updated of servicesToUpdate) {
          try {
            const { error } = await updateService(updated.id, {
              service_id: getServiceIdFromName(updated.type),
              start_date: updated.start_date,
              end_date: updated.end_date,
            });
            if (error) throw error;
            serviceUpdateSuccess = true;
            didUpdate = true;
          } catch (error) {
            console.error('Failed to update service:', error);
            toast.error('Nepavyko atnaujinti paslaugos.');
          }
        }

        // Delete services
        for (const deleted of servicesToDelete) {
          try {
            const { error } = await deleteService(deleted.id);
            if (error) throw error;
            serviceUpdateSuccess = true;
            didUpdate = true;
          } catch (error) {
            console.error('Failed to delete service:', error);
            toast.error('Nepavyko ištrinti paslaugos.');
          }
        }

        // Show a single toast for all service operations
        if (serviceUpdateSuccess) {
          toast.success('Paslaugų informacija atnaujinta!');
        }
      }
    }

    if (didUpdate) await refreshClients();
  };

  return (
    <>
      <ClientsFilterBar
        clientsData={initialClientsData?.clients || []}
        setFilteredClients={setFilteredClients}
        onNewClient={handleNewClient}
        pageSize={pagination.pageSize}
        onPageSizeChange={handlePageSizeChange}
        showAllClients={showAll}
        onShowAllChange={handleShowAllChange}
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
        isAdmin={isAdmin}
      />
    </>
  );
}
