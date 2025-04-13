import { create } from 'zustand';

const useModalStore = create((set) => ({
  isTaskModalOpen: false,
  selectedTask: null,
  openTaskModal: (task) => set({ isTaskModalOpen: true, selectedTask: task }),
  closeTaskModal: () => set({ isTaskModalOpen: false, selectedTask: null }),

  isClientModalOpen: false,
  selectedClient: null,
  openClientModal: (client) =>
    set({ isClientModalOpen: true, selectedClient: client }),
  closeClientModal: () =>
    set({ isClientModalOpen: false, selectedClient: null }),
}));

export default useModalStore;
