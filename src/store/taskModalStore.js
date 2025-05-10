import { create } from 'zustand';
import { fetchTaskById } from '../services/supabase/client/reports';

const MODAL_MODES = {
  VIEW: 'view',
  EDIT: 'edit',
  CREATE: 'create',
};

export const useTaskModalStore = create((set) => ({
  isOpen: false,
  task: null,
  mode: MODAL_MODES.VIEW,

  // openTaskModal: (task, mode = MODAL_MODES.VIEW) =>
  //   set({ isOpen: true, task, mode }),

  openTaskModal: async (taskOrId, mode = MODAL_MODES.VIEW) => {
    if (typeof taskOrId === 'string') {
      const fullTask = await fetchTaskById(taskOrId); // You'll write this
      console.log(fullTask);
      set({ isOpen: true, task: fullTask, mode });
    } else {
      set({ isOpen: true, task: taskOrId, mode });
    }
  },

  closeTaskModal: () => set({ isOpen: false, task: null }),

  setTaskModalMode: (mode) => set({ mode }),

  // Callback after data is saved.
  afterSaveCallback: null,
  setAfterSaveCallback: (callback) => set({ afterSaveCallback: callback }),
}));
