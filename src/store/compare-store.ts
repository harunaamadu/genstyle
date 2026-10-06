import { siteConfig } from "@/data/site-config";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const MAX_COMPARE = 3;

type ToggleResult = "added" | "removed" | "full";

type CompareState = {
  ids: string[];
  toggle: (id: string) => ToggleResult;
  clear: () => void;
};

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const { ids } = get();
        if (ids.includes(id)) {
          set({ ids: ids.filter((i) => i !== id) });
          return "removed";
        }
        if (ids.length >= MAX_COMPARE) return "full";
        set({ ids: [...ids, id] });
        return "added";
      },
      clear: () => set({ ids: [] }),
    }),
    { name: `${siteConfig().name || "genstyle"}-compare` }
  )
);