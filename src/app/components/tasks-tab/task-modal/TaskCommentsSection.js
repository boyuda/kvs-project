'use client';
import { useState } from 'react';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export default function TaskCommentsSection({ comments = [] }) {
  const [newComment, setNewComment] = useState('');

  return (
    <div className="flex flex-col gap-4 text-sm">
      {/* Section Title with Icon */}
      <div className="flex items-center gap-2">
        <ChatBubbleLeftIcon className="h-4 w-4 text-gray-500" />
        <h3 className="font-semibold text-gray-800">Komentarai</h3>
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-2 shadow-inner rounded-md bg-white">
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

      {/* Divider above textarea */}
      <div className="border-t border-gray-200 pt-3">
        {/* New Comment Input */}
        <textarea
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Įrašykite komentarą..."
          className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            className="bg-blue-500 text-white text-sm px-4 py-1.5 rounded-lg shadow hover:bg-blue-600 transition"
            onClick={() => {
              setNewComment('');
            }}
          >
            Pridėti
          </button>
        </div>
      </div>
    </div>
  );
}
