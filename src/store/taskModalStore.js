import { create } from 'zustand';

const MODAL_MODES = {
  VIEW: 'view',
  EDIT: 'edit',
  CREATE: 'create',
};

export const useTaskModalStore = create((set) => ({
  isOpen: false,
  task: null,
  mode: MODAL_MODES.VIEW,

  openTaskModal: (task, mode = MODAL_MODES.VIEW) =>
    set({ isOpen: true, task, mode }),

  closeTaskModal: () => set({ isOpen: false, task: null }),

  setTaskModalMode: (mode) => set({ mode }),
}));
