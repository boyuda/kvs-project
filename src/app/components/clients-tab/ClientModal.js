'use client';

import { useState, useEffect } from 'react';

import ServicesForm from './client-modal/ServicesForm';
import ClientInfoForm from './client-modal/ClientInfoForm';
import Notes from './client-modal/Notes';
import TasksList from './client-modal/TasksList';
import {
  getAssignedUserName,
  getAllUsers,
} from '@/src/services/supabase/client/users';
import { getTasksForClient } from '@/src/services/supabase/client/tasks';
import toast from 'react-hot-toast';

const MODAL_MODES = {
  VIEW: 'view',
  EDIT: 'edit',
  CREATE: 'create',
};

export default function ClientModal({
  isOpen,
  onClose,
  client = null,
  initialMode = MODAL_MODES.CREATE,
  onSave,
  isAdmin,
}) {
  const [mode, setMode] = useState(initialMode);
  const [assignedUserName, setAssignedUserName] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    street: '',
    house_number: '',
    flat_number: null,
    city: '',
    client_services: [],
    notes: '',
  });
  const [originalClient, setOriginalClient] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (client) {
      setFormData(client);
      setOriginalClient(client); // Save a snapshot for comparison
    } else {
      const emptyForm = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        street: '',
        house_number: '',
        flat_number: null,
        city: '',
        client_services: [],
        notes: '',
        assigned_user_id: '',
      };
      setFormData(emptyForm);
      setOriginalClient(null);
    }

    setMode(initialMode);
  }, [client, initialMode, isOpen]);

  useEffect(() => {
    setAssignedUserName('');

    const fetchAssignedUser = async () => {
      if (client?.assigned_user_id) {
        const name = await getAssignedUserName(client.assigned_user_id);
        setAssignedUserName(name);
      }
    };

    if (client && formData?.assigned_user_id) {
      fetchAssignedUser();
    }
  }, [client?.assigned_user_id, formData?.assigned_user_id]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers();
      setAllUsers(users);
    };
    fetchUsers();
  }, []);

  // Reset form or load client data when the modal opens
  useEffect(() => {
    if (client) {
      setFormData(client);
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        street: '',
        house_number: '',
        flat_number: null,
        city: '',
        client_services: [],
        notes: '',
      });
    }
    setMode(initialMode);
  }, [client, initialMode, isOpen]);

  //fetch tasks
  useEffect(() => {
    if (isOpen && client) {
      fetchClientTasks(client.id);
    }
  }, [isOpen, client]);

  // If modal is closed, don't render anything
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleServiceChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedServices = [...(prev.client_services || [])];
      updatedServices[index] = {
        ...updatedServices[index],
        [field]: value,
      };
      return {
        ...prev,
        client_services: updatedServices,
      };
    });
  };

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      client_services: [
        ...(prev.client_services || []),
        {
          type: 'Internetas',
          start_date: '',
          end_date: '',
        },
      ],
    }));
  };

  const removeService = (index) => {
    setFormData((prev) => ({
      ...prev,
      client_services: prev.client_services.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneRegex = /^\+370(5|6)\d{7}$/;

    if (!formData.first_name.trim()) {
      toast.error('Vardas yra privalomas.');
      return;
    }

    if (!formData.last_name.trim()) {
      toast.error('Pavardė yra privaloma.');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('El. paštas yra privalomas.');
      return;
    }

    if (!formData.phone.trim() || !phoneRegex.test(formData.phone)) {
      toast.error('Įveskite teisingą telefono numerį, kuris prasideda +370.');
      return;
    }

    if (!formData.street.trim()) {
      toast.error('Gatvė yra privaloma.');
      return;
    }

    if (!formData.house_number.trim()) {
      toast.error('Namo numeris yra privalomas.');
      return;
    }

    if (!formData.city.trim()) {
      toast.error('Miestas yra privalomas.');
      return;
    }

    if (onSave) {
      onSave(formData, mode);
    }
    onClose();
  };

  const getModalTitle = () => {
    switch (mode) {
      case MODAL_MODES.VIEW:
        return 'Klientas';
      case MODAL_MODES.EDIT:
        return 'Redaguoti Klientą';
      case MODAL_MODES.CREATE:
      default:
        return 'Naujas Klientas';
    }
  };

  const fetchClientTasks = async (clientId) => {
    console.log(clientId);
    try {
      const data = await getTasksForClient(clientId);
      setTasks(data);
    } catch (error) {
      console.error('Klaida gaunant užduotis:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-30 flex items-center justify-center">
      {/* Main modal window size */}
      <div className="bg-white rounded-lg p-6 w-full sm:max-w-2xl md:max-w-4xl 2xl:max-w-5xl mx-auto flex flex-col">
        {/* Edit client and X buttons */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{getModalTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Forma */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* If in view model, display all components */}
          {mode === MODAL_MODES.VIEW ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="flex flex-col gap-10">
                <ClientInfoForm
                  formData={formData}
                  onChange={handleInputChange}
                  isViewMode={mode === MODAL_MODES.VIEW}
                  assignedUserName={assignedUserName}
                />
                <ServicesForm
                  services={formData.client_services}
                  onServiceChange={handleServiceChange}
                  onAddService={addService}
                  onRemoveService={removeService}
                  isViewMode={mode === MODAL_MODES.VIEW}
                />
              </div>

              <div className="flex flex-col gap-10">
                <TasksList tasks={tasks} />
                <Notes
                  notes={formData.notes}
                  isViewMode={mode === MODAL_MODES.VIEW}
                />
              </div>
            </div>
          ) : (
            // Otherwise display only client and service form components
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <ClientInfoForm
                formData={formData}
                onChange={handleInputChange}
                isViewMode={false}
                isCreateMode={mode === MODAL_MODES.CREATE}
                assignedUserName={assignedUserName}
                allUsers={allUsers}
              />
              <ServicesForm
                services={formData.client_services}
                onServiceChange={handleServiceChange}
                onAddService={addService}
                onRemoveService={removeService}
                isViewMode={false}
                isAdmin={isAdmin}
              />
              <Notes
                notes={formData.notes}
                isViewMode={false}
                onChange={handleInputChange}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            {mode === MODAL_MODES.VIEW && (
              <button
                type="button"
                onClick={() => setMode(MODAL_MODES.EDIT)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
              >
                Redaguoti
              </button>
            )}

            {mode !== MODAL_MODES.VIEW && (
              <button
                type="submit"
                className="bg-blue-500 hover:bg-primaryhover text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md"
              >
                {mode === MODAL_MODES.CREATE ? 'Sukurti' : 'Išsaugoti'}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 hover:text-gray-800 transition-colors"
            >
              Atšaukti
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
