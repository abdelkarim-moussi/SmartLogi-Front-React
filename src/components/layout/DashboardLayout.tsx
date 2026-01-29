import { useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <Header isSidebarCollapsed={isSidebarCollapsed} />

            {/* Main Content */}
            <main
                className={`
          pt-16 min-h-screen
          transition-all duration-300
          ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}
        `}
            >
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
