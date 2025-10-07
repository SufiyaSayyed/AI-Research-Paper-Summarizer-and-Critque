import { Route, Routes } from "react-router-dom";
import AuthLayout from "./pages/auth/AuthLayout";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import MainLayout from "./pages/main/MainLayout";
import Home from "./pages/main/Home";
import Dashboard from "./pages/main/Dashboard";
import UploadPaper from "./pages/main/UploadPaper";
import { ProtectedRoute } from "./pages/auth/ProtectedRoute";

function App() {
  return (
    <main className="h-screen flex">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload-paper"
            element={
              <ProtectedRoute>
                <UploadPaper />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
