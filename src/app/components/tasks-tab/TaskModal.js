'use client';
import { useEffect, useState } from 'react';
import TaskInfoForm from './task-modal/TaskInfoForm';
import TaskCommentsSection from './task-modal/TaskCommentsSection';
import {
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

export default function TaskModal({ onSave, isAdmin }) {
  const { isOpen, task, mode, closeTaskModal, setTaskModalMode } =
    useTaskModalStore();

  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [originalTask, setOriginalTask] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);

  function getChangedFields(original, updated) {
    const changes = {};
    for (const key in updated) {
      if (updated[key] !== original[key]) {
        changes[key] = updated[key];
      }
    }
    return changes;
  }

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
    if (mode === 'create') {
      setFormData({
        title: '',
        due_date: '',
        client_id: '',
        type_id: '',
        status_id: '',
        description: '',
      });
    }
  }, [task, mode]);

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

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-30 flex items-center justify-center">
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
        <form onSubmit={handleSaveTask} className="space-y-6">
          {mode === 'view' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="flex flex-col gap-10">
                <TaskInfoForm mode="view" task={task} />
              </div>
              <div className="flex flex-col gap-10">
                <TaskCommentsSection
                  comments={comments}
                  onRefresh={fetchComments}
                  taskId={task?.id}
                  userId={userId}
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
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            {mode === 'view' && (
              <>
                <button
                  type="button"
                  onClick={() => console.log('Įvykdyta')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition"
                >
                  Uždaryti užduotį
                </button>
                <button
                  type="button"
                  onClick={() => setTaskModalMode('edit')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                >
                  Redaguoti
                </button>{' '}
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
