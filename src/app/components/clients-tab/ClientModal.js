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
import { useClientModalStore } from '@/src/store/clientModalStore';
import { useTaskModalStore } from '@/src/store/taskModalStore';
import toast from 'react-hot-toast';

const MODAL_MODES = {
  VIEW: 'view',
  EDIT: 'edit',
  CREATE: 'create',
};

export default function ClientModal({ onSave, isAdmin }) {
  const { isOpen, client, mode, closeClientModal, setClientModalMode } =
    useClientModalStore();
  const { openTaskModal } = useTaskModalStore();

  // const [mode, setMode] = useState(initialMode);
  const [assignedUserName, setAssignedUserName] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [formData, setFormData] = useState({});
  // const [originalClient, setOriginalClient] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Load client form
  useEffect(() => {
    if (!isOpen) return;

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
        assigned_user_id: '',
      });
    }
  }, [isOpen, client]);

  // Fetch assigned user's name
  useEffect(() => {
    const fetchAssignedUser = async () => {
      if (client?.assigned_user_id) {
        const name = await getAssignedUserName(client.assigned_user_id);
        setAssignedUserName(name);
      }
    };

    if (client?.assigned_user_id) fetchAssignedUser();
  }, [client?.assigned_user_id]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers();
      setAllUsers(users);
    };
    fetchUsers();
  }, []);

  // Fetch tasks for the client
  useEffect(() => {
    const fetchTasks = async () => {
      if (client?.id) {
        const data = await getTasksForClient(client.id);
        setTasks(data);
      }
    };

    if (isOpen && client?.id) fetchTasks();
  }, [isOpen, client?.id]);

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
    const { first_name, last_name, email, phone, street, house_number, city } =
      formData;

    if (!first_name.trim()) return toast.error('Vardas yra privalomas.');
    if (!last_name.trim()) return toast.error('Pavardė yra privaloma.');
    if (!email.trim()) return toast.error('El. paštas yra privalomas.');
    if (!phone.trim() || !phoneRegex.test(phone))
      return toast.error('Neteisingas telefono numeris.');
    if (!street.trim()) return toast.error('Gatvė yra privaloma.');
    if (!house_number.trim())
      return toast.error('Namo numeris yra privalomas.');
    if (!city.trim()) return toast.error('Miestas yra privalomas.');

    if (onSave) onSave(formData, mode);
    closeClientModal();
  };

  const handleTaskClick = (task) => {
    closeClientModal();
    setTimeout(() => {
      openTaskModal(task, 'view');
    }, 200);
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

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-30 flex items-center justify-center">
      {/* Main modal window size */}
      <div className="bg-white rounded-lg p-6 w-full sm:max-w-2xl md:max-w-4xl 2xl:max-w-5xl mx-auto flex flex-col">
        {/* Edit client and X buttons */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{getModalTitle()}</h2>
          <button
            onClick={closeClientModal}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Forma */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* If in view model, display all components */}
          {mode === 'view' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="flex flex-col gap-10">
                <ClientInfoForm
                  formData={formData}
                  onChange={handleInputChange}
                  isViewMode
                  assignedUserName={assignedUserName}
                />
                <ServicesForm
                  services={formData.client_services}
                  onServiceChange={handleServiceChange}
                  onAddService={addService}
                  onRemoveService={removeService}
                  isViewMode
                />
              </div>

              <div className="flex flex-col gap-10">
                <TasksList tasks={tasks} onTaskClick={handleTaskClick} />
                <Notes notes={formData.notes} isViewMode={mode === 'view'} />
              </div>
            </div>
          ) : (
            // Otherwise display only client and service form components
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <ClientInfoForm
                formData={formData}
                onChange={handleInputChange}
                isViewMode={false}
                isCreateMode={mode === 'create'}
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
            {mode === 'view' && (
              <button
                type="button"
                onClick={() => setClientModalMode('edit')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
              >
                Redaguoti
              </button>
            )}

            {mode !== 'view' && (
              <button
                type="submit"
                className="bg-blue-500 hover:bg-primaryhover text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md"
              >
                {mode === 'create' ? 'Sukurti' : 'Išsaugoti'}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (mode === 'edit') {
                  setClientModalMode('view');
                } else {
                  closeClientModal();
                }
              }}
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
