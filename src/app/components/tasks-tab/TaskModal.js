'use client';
import { useState, useEffect } from 'react';
import TaskInfoForm from './task-modal/TaskInfoForm';
import TaskCommentsSection from './task-modal/TaskCommentsSection';
import TaskActivity from './task-modal/TaskActivity';
import { getCommentsForTask } from '@/src/services/supabase/client/tasks';
import { getLoggedInUserId } from '@/src/services/supabase/client/users';

const MODAL_MODES = {
  VIEW: 'view',
  EDIT: 'edit',
  CREATE: 'create',
};

export default function TaskModal({
  isOpen,
  onClose,
  task = null,
  initialMode = MODAL_MODES.CREATE,
  onSave,
  isAdmin,
}) {
  // States
  const [mode, setMode] = useState(initialMode);
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);

  // Effects
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Fetch selected task comments
  useEffect(() => {
    if (task && mode === MODAL_MODES.VIEW) {
      fetchComments();
    }
  }, [task, mode]);

  // Fetch logged in user
  useEffect(() => {
    const fetchUser = async () => {
      const id = await getLoggedInUserId();
      setUserId(id);
    };

    fetchUser();
  }, []);

  // Functions
  const getModalTitle = () => {
    switch (mode) {
      case MODAL_MODES.VIEW:
        return 'Užduotis';
      case MODAL_MODES.EDIT:
        return 'Redaguoti Užduotį';
      case MODAL_MODES.CREATE:
      default:
        return 'Nauja Užduotis';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submitted');
    // const phoneRegex = /^\+370(5|6)\d{7}$/;

    // if (!formData.first_name.trim()) {
    //   toast.error('Vardas yra privalomas.');
    //   return;
    // }

    // if (!formData.last_name.trim()) {
    //   toast.error('Pavardė yra privaloma.');
    //   return;
    // }

    // if (!formData.email.trim()) {
    //   toast.error('El. paštas yra privalomas.');
    //   return;
    // }

    // if (!formData.phone.trim() || !phoneRegex.test(formData.phone)) {
    //   toast.error('Įveskite teisingą telefono numerį, kuris prasideda +370.');
    //   return;
    // }

    // if (!formData.street.trim()) {
    //   toast.error('Gatvė yra privaloma.');
    //   return;
    // }

    // if (!formData.house_number.trim()) {
    //   toast.error('Namo numeris yra privalomas.');
    //   return;
    // }

    // if (!formData.city.trim()) {
    //   toast.error('Miestas yra privalomas.');
    //   return;
    // }

    // if (onSave) {
    //   onSave(formData, mode);
    // }
    // onClose();
  };
  const fetchComments = async () => {
    if (!task) return;

    try {
      const data = await getCommentsForTask(task.id);
      const formatted = data.map((c) => ({
        author: `${c.users?.name || ''} ${c.users?.last_name || ''}`,
        date: new Date(c.created_at).toLocaleString('lt-LT', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),

        text: c.comment,
      }));
      setComments(formatted);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  if (!isOpen) return null;

  // markup
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
                <TaskInfoForm
                  isViewMode={mode === MODAL_MODES.VIEW}
                  task={task}
                />
                {/* SUGGESTION: Add task activity section or any other component to fill in the gap */}
              </div>

              <div className="flex flex-col gap-10">
                <TaskCommentsSection
                  comments={comments}
                  onRefresh={fetchComments}
                  taskId={task.id}
                  userId={userId}
                />
              </div>
            </div>
          ) : (
            // Otherwise display only client and service form components
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <h1>this is create part</h1>
              {/* <ClientInfoForm
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
              /> */}
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
