'use client';
import { useEffect, useState } from 'react';
import TaskInfoForm from './task-modal/TaskInfoForm';
import TaskCommentsSection from './task-modal/TaskCommentsSection';
import { getCommentsForTask } from '@/src/services/supabase/client/tasks';
import { getLoggedInUserId } from '@/src/services/supabase/client/users';
import { useTaskModalStore } from '@/src/store/taskModalStore';

export default function TaskModal({ onSave, isAdmin }) {
  const { isOpen, task, mode, closeTaskModal, setTaskModalMode } =
    useTaskModalStore();

  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (task && mode === 'view') {
      fetchComments();
    }
  }, [task, mode]);

  useEffect(() => {
    const fetchUser = async () => {
      const id = await getLoggedInUserId();
      setUserId(id);
    };
    fetchUser();
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submitted');
  };

  if (!isOpen || !task?.id) return null;

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'view' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="flex flex-col gap-10">
                <TaskInfoForm isViewMode={true} task={task} />
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <h1>this is create part</h1>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            {mode === 'view' && (
              <button
                type="button"
                onClick={() => setTaskModalMode('edit')}
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
              onClick={closeTaskModal}
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
