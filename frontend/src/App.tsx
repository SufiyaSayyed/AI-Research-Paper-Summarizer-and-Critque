import { Route, Routes } from "react-router-dom";
import AuthLayout from "./pages/auth/AuthLayout";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import MainLayout from "./pages/main/MainLayout";
import { ProtectedRoute } from "./pages/auth/ProtectedRoute";
import Landing from "./pages/main/Landing";
import Chat from "./pages/main/Chat";
import Dashboard from "./pages/main/Dashboard";

function App() {
  return (
    <main className="h-screen flex">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute>
              <Dashboard />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              // <ProtectedRoute>
              <Chat />
              // </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
