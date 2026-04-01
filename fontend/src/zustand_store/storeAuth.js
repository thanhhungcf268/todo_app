import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { decryptDataCrypto, encryptDataCrypto } from "../utils";
const useStoreAuth = create(
  persist(
    (set) => ({
      permissions: [], // Mặc định là mảng rỗng
      setPermissions: (value) => set({ permissions: value }),
      clearAuth: () => set({ permissions: [] }),
    }),
    {
      name: "p_data", // Tên key trong localStorage
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? decryptDataCrypto(value) : null // Giải mã trước khi trả về cho Zustand
        },
        setItem: (name, value) => {
          const encrypted = encryptDataCrypto(value); // Mã hóa chuỗi JSON trước khi lưu
          localStorage.setItem(name, encrypted);
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
    },
  ),
);

export default useStoreAuth;
