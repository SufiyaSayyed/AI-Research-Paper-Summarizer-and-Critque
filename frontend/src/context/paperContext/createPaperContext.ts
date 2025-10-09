import type { PaperContextType } from "@/types";
import { createContext } from "react";

export const PaperContext = createContext<PaperContextType | null>(null)