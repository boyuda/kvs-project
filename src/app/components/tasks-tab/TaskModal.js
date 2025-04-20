'use client';
import { useEffect, useState } from 'react';
import TaskInfoForm from './task-modal/TaskInfoForm';
import TaskCommentsSection from './task-modal/TaskCommentsSection';
import {
  createTask,
  getCommentsForTask,
  getTaskById,
  getTaskStatuses,
  getTaskTypes,
} from '@/src/services/supabase/client/tasks';
import { getLoggedInUserId } from '@/src/services/supabase/client/users';
import { useTaskModalStore } from '@/src/store/taskModalStore';
import { getAllUsers } from '@/src/services/supabase/client/users';
import { updateTask } from '@/src/services/supabase/client/tasks';
import toast from 'react-hot-toast';
import { searchClientsByName } from '@/src/services/supabase/client/clients';
import debounce from 'lodash.debounce';
import ConditionalSalesFields from './task-modal/ConditionalSalesFields';
import { getClientServicesByClientId } from '@/src/services/supabase/client/clients';
import { updateClientService } from '@/src/services/supabase/client/clients';

import { insertSale } from '@/src/services/supabase/client/sales';
import { addService } from '@/src/services/supabase/client/clients';
export default function TaskModal({ isAdmin }) {
  const { isOpen, task, mode, closeTaskModal, setTaskModalMode } =
    useTaskModalStore();

  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [originalTask, setOriginalTask] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);
  const [clientSearchResults, setClientSearchResults] = useState([]);
  const [clientSearchLoading, setClientSearchLoading] = useState(false);
  const [clientServices, setClientServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');

  // Conditional Rendering if task is closed
  const isClosed = task?.task_statuses?.slug === 'closed';
  const isReadOnly = isClosed && !isAdmin;

  function getChangedFields(original, updated) {
    const changes = {};
    for (const key in updated) {
      if (updated[key] !== original[key]) {
        changes[key] = updated[key];
      }
    }
    return changes;
  }

  // Fetch client services
  useEffect(() => {
    const fetchClientServices = async () => {
      if (task?.client_id?.id && task.task_types?.slug === 'contract_renewal') {
        const services = await getClientServicesByClientId(task.client_id.id);
        setClientServices(services);
      }
    };

    fetchClientServices();
  }, [task]);

  // reset services in view mode if window is closed
  useEffect(() => {
    if (!isOpen && mode === 'view') {
      setSelectedServiceId('');
      setSelectedTerm('');
    }
  }, [isOpen, mode]);

  // Fetch comments of the task
  useEffect(() => {
    if (task && mode === 'view') {
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

  // Fetch details for the modal edit and create view
  useEffect(() => {
    if (!isOpen) return;

    if (task && mode === 'edit') {
      const flatTask = {
        id: task.id,
        title: task.title,
        due_date: task.due_date,
        type_id: task.task_types?.id || '',
        status_id: task.task_statuses?.id || '',
        assigned_user_id: task.assigned_user_id?.id || '',
        description: task.description || '',
      };
      setFormData(flatTask);
      setOriginalTask(flatTask);
    }
    // Precautious to make sure that we get userId on time for sure
    if (mode === 'create' && userId) {
      setFormData({
        title: '',
        due_date: '',
        // If task being created from the client window, fetch client data and fill in the task client field automatically.
        client_id: task?.client_id || '',
        client_name: task?.client_name || '',
        type_id: '',
        status_id: '',
        description: '',
        assigned_user_id: userId,
      });
      setClientSearchResults([]);
    }
  }, [task, mode, isOpen]);

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

  // Fetch users, types and statuses
  useEffect(() => {
    const fetchDropdownData = async () => {
      const [users, types, statuses] = await Promise.all([
        getAllUsers(),
        getTaskTypes(),
        getTaskStatuses(),
      ]);
      setAllUsers(users);
      setTaskTypes(types);
      setTaskStatuses(statuses);
    };

    fetchDropdownData();
  }, []);

  // If modal is closed, don't render anything
  if (!isOpen) return null;
  // Checking if isAdmin is undefined, to avoid visual bugs for rendering the components
  // Leaving this as a safety net.
  if (isAdmin === undefined) return null;

  const getModalTitle = () => {
    switch (mode) {
      case 'view':
        return 'Užduotis';
      case 'edit':
        return 'Redaguoti Užduotį';
      case 'create':
      default:
        return 'Nauja Užduotis';
    }
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!originalTask || !formData) return;

    const changes = getChangedFields(originalTask, formData);

    if (Object.keys(changes).length === 0) {
      toast('Nėra jokių pakeitimų.');
      setTaskModalMode('view');
      return;
    }

    try {
      const { error } = await updateTask(originalTask.id, changes);
      if (error) throw error;

      const updatedTask = await getTaskById(task.id);
      if (updatedTask) {
        useTaskModalStore.getState().openTaskModal(updatedTask, 'view');
      }
      // Trigger refresh in TaskContainer.
      const callback = useTaskModalStore.getState().afterSaveCallback;
      if (callback) callback();

      toast.success('Užduotis sėkmingai atnaujinta!');
      setTaskModalMode('view');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Nepavyko atnaujinti užduoties.');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    const { title, due_date, client_id, type_id, description } = formData;

    // Validation
    if (!title.trim()) return toast.error('Pavadinimas yra privalomas.');
    if (title.length < 5)
      return toast.error('Pavadinimas negali būti trumpesnis nei 5 simboliai.');
    if (!due_date) return toast.error('Pasirinkite terminą.');
    if (!client_id) return toast.error('Pasirinkite klientą.');
    if (!type_id) return toast.error('Pasirinkite užduoties tipą.');

    const newTask = {
      title,
      due_date,
      client_id,
      type_id,
      status_id: 'be3848f2-486e-4544-a6b0-da80927c5bfd',
      assigned_user_id: userId, // reuse the fetched user ID
      description,
    };

    try {
      const { data, error } = await createTask(newTask);
      if (error) throw error;

      toast.success('Užduotis sėkmingai sukurta!');
      // Closing Task Modal
      closeTaskModal();

      // Refresh the list
      const callback = useTaskModalStore.getState().afterSaveCallback;
      if (callback) callback();
    } catch (error) {
      console.error('Klaida: ', error);
      toast.error('Nepavyko sukurti užduoties');
    }
  };

  const handleCloseTask = async () => {
    if (!task) return;

    const today = new Date().toISOString().split('T')[0];
    const closedStatusId = await getClosedStatusId();
    if (!closedStatusId) {
      toast.error('Nepavyko gauti uždarymo statuso.');
      return;
    }

    try {
      // If its contract Renewal
      if (task.task_types?.slug === 'contract_renewal') {
        const selectedService = clientServices.find(
          (s) => s.id === selectedServiceId
        );

        // Calculate new end date
        const currentDate = new Date(selectedService?.end_date);
        currentDate.setMonth(currentDate.getMonth() + Number(selectedTerm));
        const newEndDate = currentDate.toISOString().split('T')[0];

        //Update client service
        await updateClientService(selectedServiceId, {
          start_date: today,
          end_date: newEndDate,
        });
        // Checking
        console.log('Inserting sale with:', {
          task_id: task.id,
          client_id: task.client_id.id,
          service_id: selectedServiceId,
          user_id: userId,
          amount: parseFloat(selectedAmount),
          sale_date: today,
          term: parseInt(selectedTerm),
          type: 'contract_renewal',
        });

        // Insert into sales table
        await insertSale({
          task_id: task.id,
          client_id: task.client_id.id,
          client_service_id: selectedServiceId,
          user_id: userId,
          amount: parseFloat(selectedAmount),
          sale_date: today,
          term: parseInt(selectedTerm),
          type: 'contract_renewal',
        });
      }

      // Later: handle `new_service` creation logic here
      if (task.task_types?.slug === 'new_service') {
        // Calculate end date
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + Number(selectedTerm));
        const endDateFormatted = endDate.toISOString().split('T')[0];

        console.log(selectedServiceId);
        const newService = {
          client_id: task.client_id.id,
          service_id: selectedServiceId,
          start_date: today, // reuse the calculated today
          end_date: endDateFormatted,
        };

        const { data: insertedService, error: insertError } = await addService(
          newService
        );
        if (insertError || !insertedService || insertedService.length === 0) {
          throw insertError || new Error('Nepavyko pridėti naujos paslaugos.');
        }

        const clientServiceId = insertedService[0].id;

        console.log('Inserting sale with:', {
          task_id: task.id,
          client_id: task.client_id.id,
          service_id: selectedServiceId,
          user_id: userId,
          amount: parseFloat(selectedAmount),
          sale_date: today,
          term: parseInt(selectedTerm),
          type: 'contract_renewal',
        });

        // Insert into sales
        await insertSale({
          task_id: task.id,
          client_id: task.client_id.id,
          service_id: selectedServiceId,
          user_id: userId,
          amount: parseFloat(selectedAmount),
          sale_date: today,
          term: parseInt(selectedTerm),
          type: 'new_service',
          client_service_id: clientServiceId,
        });
      }

      // Update task status + close_date
      await updateTask(task.id, {
        status_id: closedStatusId,
        close_date: today,
      });

      toast.success('Užduotis sėkmingai uždaryta!');
      closeTaskModal();

      // Refresh
      const callback = useTaskModalStore.getState().afterSaveCallback;
      if (callback) callback();
    } catch (error) {
      console.error('Uždarymo klaida:', error);
      toast.error('Nepavyko uždaryti užduoties.');
    }
  };

  const handleClientSearch = debounce(async (searchTerm) => {
    if (searchTerm.length < 3) {
      setClientSearchResults([]);
      return;
    }
    setClientSearchLoading(true);
    try {
      const results = await searchClientsByName(searchTerm);
      setClientSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setClientSearchLoading(false);
    }
  }, 400);

  async function getClosedStatusId() {
    const statuses = await getTaskStatuses();
    const closedStatus = statuses.find((s) => s.slug === 'closed');
    return closedStatus?.id || null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-start overflow-y-auto pt-10 pb-10">
      <div className="bg-white rounded-lg p-6 w-full sm:max-w-2xl md:max-w-4xl 2xl:max-w-5xl mx-auto flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{getModalTitle()}</h2>
          <button
            onClick={closeTaskModal}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Handle View */}
        <form
          onSubmit={mode === 'create' ? handleCreateTask : handleSaveTask}
          className="space-y-6"
        >
          {mode === 'view' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="flex flex-col gap-10">
                <TaskInfoForm mode="view" task={task} />

                {/* This will render depending on task type slug in the modal.*/}
                {['contract_renewal', 'new_service'].includes(
                  task?.task_types?.slug
                ) &&
                  (!isClosed || isAdmin) && (
                    <ConditionalSalesFields
                      selectedType={task.task_types.slug}
                      clientServices={clientServices}
                      selectedServiceId={selectedServiceId}
                      setSelectedServiceId={setSelectedServiceId}
                      selectedTerm={selectedTerm}
                      setSelectedTerm={setSelectedTerm}
                      selectedAmount={selectedAmount}
                      setSelectedAmount={setSelectedAmount}
                    />
                  )}
              </div>

              <div className="flex flex-col gap-10">
                <TaskCommentsSection
                  comments={comments}
                  onRefresh={fetchComments}
                  taskId={task?.id}
                  userId={userId}
                  isReadOnly={isReadOnly}
                />
              </div>
            </div>
          )}

          {/* Handle Edit */}
          {mode === 'edit' && (
            // TODO: Change sizing
            <div className="w-full sm:w-[60%]">
              <TaskInfoForm
                mode={mode}
                task={task}
                allUsers={allUsers}
                taskTypes={taskTypes}
                taskStatuses={taskStatuses}
                formData={formData}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </div>
          )}

          {mode === 'create' && (
            <div className="w-full sm:w-[60%]">
              <TaskInfoForm
                mode={mode}
                formData={formData}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                taskTypes={taskTypes}
                taskStatuses={taskStatuses}
                onClientSearch={(value) => handleClientSearch(value)}
                clientOptions={clientSearchResults}
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            {mode === 'view' && (
              <>
                {/* If the task is closed and user is not an admin, edit and save buttons are hidden. */}
                {!isReadOnly && (
                  <>
                    <button
                      type="button"
                      onClick={handleCloseTask}
                      disabled={
                        task?.task_types?.slug === 'contract_renewal' &&
                        (!selectedServiceId || !selectedTerm)
                      }
                      className={`px-4 py-2 rounded-lg text-sm text-white transition ${
                        task?.task_types?.slug === 'contract_renewal' &&
                        (!selectedServiceId || !selectedTerm)
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      Uždaryti užduotį
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaskModalMode('edit')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                    >
                      Redaguoti
                    </button>
                  </>
                )}
              </>
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
              // Go back to view mode if not saving anything
              onClick={() => {
                if (mode === 'edit') {
                  setTaskModalMode('view');
                } else {
                  closeTaskModal();
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
