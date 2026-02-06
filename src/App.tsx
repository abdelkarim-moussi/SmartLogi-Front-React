import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ui/Toast";
import ProtectedRoute, { UnauthorizedPage } from "./components/ProtectedRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import RolesManagement from "./pages/admin/RolesManagement";
import PermissionsManagement from "./pages/admin/PermissionsManagement";
import UsersManagement from "./pages/admin/UsersManagement";

// Manager Pages
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import PackagesManagement from "./pages/manager/PackagesManagement";
import DeliveryPersonsManagement from "./pages/manager/DeliveryPersonsManagement";
import ClientsManagement from "./pages/manager/ClientsManagement";

// Client Pages
import ClientDashboard from "./pages/client/ClientDashboard";
import CreatePackage from "./pages/client/CreatePackage";
import MyPackages from "./pages/client/MyPackages";
import PackageHistory from "./pages/client/PackageHistory";

// Delivery Person Pages
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import AssignedPackages from "./pages/delivery/AssignedPackages";
import DeliveryHistory from "./pages/delivery/DeliveryHistory";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/roles"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <RolesManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/permissions"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PermissionsManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <UsersManagement />
                </ProtectedRoute>
              }
            />

            {/* Manager Routes */}
            <Route
              path="/manager"
              element={
                <ProtectedRoute allowedRoles={["MANAGER"]}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/packages"
              element={
                <ProtectedRoute allowedRoles={["MANAGER"]}>
                  <PackagesManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/delivery-persons"
              element={
                <ProtectedRoute allowedRoles={["MANAGER"]}>
                  <DeliveryPersonsManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/clients"
              element={
                <ProtectedRoute allowedRoles={["MANAGER"]}>
                  <ClientsManagement />
                </ProtectedRoute>
              }
            />

            {/* Client Routes */}
            <Route
              path="/client"
              element={
                <ProtectedRoute allowedRoles={["CLIENT"]}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/create-package"
              element={
                <ProtectedRoute allowedRoles={["CLIENT"]}>
                  <CreatePackage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/packages"
              element={
                <ProtectedRoute allowedRoles={["CLIENT"]}>
                  <MyPackages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/history"
              element={
                <ProtectedRoute allowedRoles={["CLIENT"]}>
                  <PackageHistory />
                </ProtectedRoute>
              }
            />

            {/* Delivery Person Routes */}
            <Route
              path="/delivery"
              element={
                <ProtectedRoute allowedRoles={["LIVREUR"]}>
                  <DeliveryDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery/packages"
              element={
                <ProtectedRoute allowedRoles={["LIVREUR"]}>
                  <AssignedPackages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery/history"
              element={
                <ProtectedRoute allowedRoles={["LIVREUR"]}>
                  <DeliveryHistory />
                </ProtectedRoute>
              }
            />

            {/* Default Route - Redirect to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Catch all - Redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
