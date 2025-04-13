import { create } from 'zustand';

const MODAL_MODES = {
  VIEW: 'view',
  EDIT: 'edit',
  CREATE: 'create',
};

export const useClientModalStore = create((set) => ({
  isOpen: false,
  client: null,
  mode: MODAL_MODES.VIEW,

  openClientModal: (client, mode = MODAL_MODES.VIEW) =>
    set({ isOpen: true, client, mode }),

  closeClientModal: () => set({ isOpen: false, client: null }),

  setClientModalMode: (mode) => set({ mode }),
}));
