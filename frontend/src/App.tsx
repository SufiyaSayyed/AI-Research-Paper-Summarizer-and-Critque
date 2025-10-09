import { Route, Routes } from "react-router-dom";
import AuthLayout from "./pages/auth/AuthLayout";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import MainLayout from "./pages/main/MainLayout";
import { ProtectedRoute } from "./pages/auth/ProtectedRoute";
import Landing from "./pages/main/Landing";
import Dashboard from "./pages/main/Dashboard";
import Upload from "./pages/main/Upload";
import Summary from "./pages/main/Summary";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route
          path="/upload"
          element={
            // <ProtectedRoute>
            <Upload />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
            <Dashboard />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/summary"
          element={
            // <ProtectedRoute>
            <Summary />
            // </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
