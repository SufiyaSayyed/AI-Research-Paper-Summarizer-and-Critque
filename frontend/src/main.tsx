import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./api/config/QueryProvider.tsx";
import { AuthProvider } from "./context/authContext/AuthContext.tsx";
import { PaperProvider } from "./context/paperContext/PaperContext.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <PaperProvider>
            <App />
            <Toaster />
          </PaperProvider>
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>
);
