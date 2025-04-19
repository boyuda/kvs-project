'use client';

import { useTaskModalStore } from '@/src/store/taskModalStore';

export default function NewTaskButton() {
  const { openTaskModal } = useTaskModalStore();

  return (
    <button
      className="bg-blue-500 hover:bg-primaryhover text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md"
      onClick={() => openTaskModal(null, 'create')}
    >
      Nauja užduotis
    </button>
  );
}
