import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../types";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles?: UserRole[];
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { user, hasRole } = useAuth();

  // Navigation items by role
  const adminNavItems: NavItem[] = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: <HomeIcon />,
      roles: ["ADMIN"],
    },
    {
      label: "Roles",
      path: "/admin/roles",
      icon: <ShieldIcon />,
      roles: ["ADMIN"],
    },
    {
      label: "Permissions",
      path: "/admin/permissions",
      icon: <KeyIcon />,
      roles: ["ADMIN"],
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: <UsersIcon />,
      roles: ["ADMIN"],
    },
  ];

  const managerNavItems: NavItem[] = [
    {
      label: "Dashboard",
      path: "/manager",
      icon: <HomeIcon />,
      roles: ["MANAGER"],
    },
    {
      label: "Packages",
      path: "/manager/packages",
      icon: <PackageIcon />,
      roles: ["MANAGER"],
    },
    {
      label: "Delivery Persons",
      path: "/manager/delivery-persons",
      icon: <TruckIcon />,
      roles: ["MANAGER"],
    },
    {
      label: "Clients",
      path: "/manager/clients",
      icon: <UsersIcon />,
      roles: ["MANAGER"],
    },
  ];

  const clientNavItems: NavItem[] = [
    {
      label: "Dashboard",
      path: "/client",
      icon: <HomeIcon />,
      roles: ["CLIENT"],
    },
    {
      label: "New Package",
      path: "/client/create-package",
      icon: <PlusIcon />,
      roles: ["CLIENT"],
    },
    {
      label: "My Packages",
      path: "/client/packages",
      icon: <PackageIcon />,
      roles: ["CLIENT"],
    },
    {
      label: "History",
      path: "/client/history",
      icon: <ClockIcon />,
      roles: ["CLIENT"],
    },
  ];

  const deliveryNavItems: NavItem[] = [
    {
      label: "Dashboard",
      path: "/delivery",
      icon: <HomeIcon />,
      roles: ["LIVREUR"],
    },
    {
      label: "Assigned Packages",
      path: "/delivery/packages",
      icon: <PackageIcon />,
      roles: ["LIVREUR"],
    },
    {
      label: "History",
      path: "/delivery/history",
      icon: <ClockIcon />,
      roles: ["LIVREUR"],
    },
  ];

  // Get nav items based on role
  const getNavItems = (): NavItem[] => {
    if (hasRole("ADMIN")) return adminNavItems;
    if (hasRole("MANAGER")) return managerNavItems;
    if (hasRole("CLIENT")) return clientNavItems;
    if (hasRole("LIVREUR")) return deliveryNavItems;
    return [];
  };

  const navItems = getNavItems();

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 h-screen
        bg-gradient-to-b from-slate-900 to-slate-800
        border-r border-slate-700/50
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700/50">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TruckIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">SmartLogi</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
        >
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>

      {/* User Info */}
      <div
        className={`px-4 py-4 border-b border-slate-700/50 ${isCollapsed ? "text-center" : ""}`}
      >
        <div className="w-10 h-10 mx-auto bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
          {user?.prenom?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
        </div>
        {!isCollapsed && (
          <div className="mt-2">
            <p className="text-sm font-medium text-white truncate">
              {user?.prenom ? `${user.prenom} ${user.nom || ""}` : user?.email}
            </p>
            <p className="text-xs text-slate-400 capitalize">
              {user?.role?.toLowerCase()}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={
              item.path === "/admin" ||
              item.path === "/manager" ||
              item.path === "/client" ||
              item.path === "/delivery"
            }
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl
              transition-all duration-200
              ${
                isActive
                  ? "text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }
              ${isCollapsed ? "justify-center" : ""}
            `}
            title={isCollapsed ? item.label : undefined}
          >
            <span className="shrink-0">{item.icon}</span>
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

// Icon Components
function HomeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function PackageIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );
}

function TruckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 17h8M8 17a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 102 0h-2zm-8 0h2m6 0h2M3 13V5a2 2 0 012-2h6l4 4h4a2 2 0 012 2v4m-6 0h.01"
      />
    </svg>
  );
}

function UsersIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function ShieldIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function KeyIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
      />
    </svg>
  );
}

function PlusIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  );
}

function ClockIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ChevronLeftIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
}

function ChevronRightIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}
