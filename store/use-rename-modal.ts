import { create } from 'zustand'
interface RenameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRename: (id: string, title: string) => void;
    id: string;
    title: string;
}
export const useRenameModal = create<RenameModalProps>((set) => ({
    isOpen: false,
    onClose: () => set({ isOpen: false , id: "", title: ""}),
    onRename: (id: string,  title: string) => set({ isOpen: true, id, title }),
    id: "",
    title: "",
}))