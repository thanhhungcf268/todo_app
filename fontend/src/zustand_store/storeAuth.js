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
          const encryptedValue = localStorage.getItem(name);
          if (!encryptedValue) return null;

          try {
            // 1. Giải mã chuỗi từ localStorage
            const decryptedRaw = decryptDataCrypto(encryptedValue);
            return JSON.parse(decryptedRaw);
          } catch (error) {
            console.error("Lỗi giải mã hoặc parse JSON:", error);
            return null;
          }
        },
        setItem: (name, value) => {
          const encrypted = encryptDataCrypto(value);
          localStorage.setItem(name, encrypted);
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
    },
  ),
);

export default useStoreAuth;
