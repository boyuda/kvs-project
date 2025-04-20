'use client';
import { useState } from 'react';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { addCommentToTask } from '@/src/services/supabase/client/tasks';
import {
  updateTask,
  getTaskStatuses,
} from '@/src/services/supabase/client/tasks';
import toast from 'react-hot-toast';

export default function TaskCommentsSection({
  comments = [],
  onRefresh,
  taskId,
  userId,
  isReadOnly,
  taskStatusSlug,
  onTaskStatusChange,
}) {
  const [newComment, setNewComment] = useState('');
  // Loading state for the new comment to be added.
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    const trimmedComment = newComment.trim();

    // If empty
    if (!trimmedComment) {
      toast.error('Komentaras negali būti tuščias.');
      return;
    }

    // If less than 5 symbols
    if (trimmedComment.length < 5) {
      toast.error('Komentaras negali būti trumpesnis nei 5 simboliai.');
      return;
    }
    if (trimmedComment.match(/^[0-9]+$/)) {
      toast.error('Komentaras negali būti sudarytas tik iš skaičių.');
      return;
    }

    try {
      setLoading(true);

      // update status if it's currently atviras
      if (taskStatusSlug === 'open') {
        const statuses = await getTaskStatuses();
        const inProgress = statuses.find((s) => s.slug === 'in_progress');
        if (inProgress?.id) {
          await updateTask(taskId, { status_id: inProgress.id });
        }
        // Refresh view
        if (onTaskStatusChange) onTaskStatusChange();
      }

      // add comment
      await addCommentToTask(taskId, userId, newComment.trim());
      toast.success('Komentaras pridėtas!');
      setNewComment('');
      onRefresh();
    } catch (err) {
      toast.error('Nepavyko pridėti komentaro.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 text-sm">
      {/* Section Title with Icon */}
      <div className="flex items-center gap-2">
        <ChatBubbleLeftIcon className="h-4 w-4 text-gray-500" />
        <h3 className="font-semibold text-gray-800">Komentarai</h3>
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2 shadow-inner rounded-md bg-white">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic px-2">Komentarų nėra</p>
        ) : (
          comments.map((comment, index) => (
            <div
              key={index}
              className="border border-gray-100 px-3 py-2 rounded-md bg-gray-50"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-[13px] text-gray-800">
                  {comment.author}
                </span>
                <span className="text-[13px] text-gray-400">
                  {comment.date}
                </span>
              </div>
              <p className="text-[13px] text-gray-700 break-words whitespace-pre-line leading-snug">
                {comment.text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-3">
        {/* New Comment Input */}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Įrašykite komentarą..."
          className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          disabled={isReadOnly}
        />
        <div className="flex justify-end mt-2">
          {!isReadOnly ? (
            <button
              className="bg-blue-500 text-white text-sm px-4 py-1.5 rounded-lg shadow hover:bg-blue-600 transition disabled:opacity-50"
              disabled={loading}
              onClick={handleAddComment}
            >
              {loading ? 'Pridedama...' : 'Pridėti'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
