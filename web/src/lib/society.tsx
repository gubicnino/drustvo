import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "./api";
import type { Society } from "../types";

const SocietyContext = createContext<Society | null>(null);

export function SocietyProvider({ children }: { children: ReactNode }) {
  const [society, setSociety] = useState<Society | null>(null);

  useEffect(() => {
    api.getSociety().then(setSociety).catch(() => {});
  }, []);

  return <SocietyContext.Provider value={society}>{children}</SocietyContext.Provider>;
}

/** Lahko vrne null, dokler se podatki nalagajo. */
export function useSociety(): Society | null {
  return useContext(SocietyContext);
}
