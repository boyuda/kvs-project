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

  // Set assigned user name when client data is loaded

  useEffect(() => {
    const fetchAssignedUser = async () => {
      if (client?.assigned_user_id) {
        const name = await getAssignedUserName(client.assigned_user_id);
        setAssignedUserName(name);
      }
    };
    fetchAssignedUser();
  }, [client]);

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
          startDate: '',
          endDate: '',
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

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-30 flex items-center justify-center">
      {/* Pagrindinis langas issokantis ir jo dizainas / dydis */}
      <div className="bg-white rounded-lg p-6 w-full sm:max-w-2xl md:max-w-4xl 2xl:max-w-5xl mx-auto flex flex-col">
        {/* Redaguoti klienta ir X mygtukas */}
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
                <TasksList />
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
                assignedUserName={assignedUserName}
                allUsers={allUsers}
              />
              <ServicesForm
                services={formData.client_services}
                onServiceChange={handleServiceChange}
                onAddService={addService}
                onRemoveService={removeService}
                isViewMode={false}
              />
              <Notes
                notes={formData.notes}
                isViewMode={mode === MODAL_MODES.VIEW}
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
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
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
              className="border border-gray-300 px-4 py-2 rounded-lg text-sm"
            >
              Atšaukti
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
