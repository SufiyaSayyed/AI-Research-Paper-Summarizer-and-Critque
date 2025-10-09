import { useState, type ReactNode } from "react";
import { PaperContext } from "./createPaperContext";

export const PaperProvider = ({ children }: {children: ReactNode}) => {
  const [docId, setDocId] = useState("");
  return (
    <PaperContext.Provider value={{ docId, setDocId }}>
      {children}
    </PaperContext.Provider>
  );
};
