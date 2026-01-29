import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import DashboardLayout from './layout/DashboardLayout';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, hasRole } = useAuth();
    const location = useLocation();

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-600 dark:text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role authorization if roles are specified
    if (allowedRoles && allowedRoles.length > 0) {
        if (!hasRole(allowedRoles)) {
            // Redirect to appropriate dashboard based on user role
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Wrap in dashboard layout
    return <DashboardLayout>{children}</DashboardLayout>;
}

// Unauthorized page component
export function UnauthorizedPage() {
    const { user } = useAuth();

    // Determine redirect path based on role
    const getRedirectPath = () => {
        switch (user?.role) {
            case 'ADMIN':
                return '/admin';
            case 'MANAGER':
                return '/manager';
            case 'CLIENT':
                return '/client';
            case 'LIVREUR':
                return '/delivery';
            default:
                return '/login';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Access Denied
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    You don't have permission to access this page.
                </p>
                <a
                    href={getRedirectPath()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
                >
                    Go to Dashboard
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
            </div>
        </div>
    );
}
