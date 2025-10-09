import { useContext } from "react";
import { PaperContext } from "../context/paperContext/createPaperContext";

export const usePaper = () => {
  const ctx = useContext(PaperContext);
  if (!ctx)
    throw new Error("UserPaper Context must be used within PaperProvider");
  return ctx;
};
