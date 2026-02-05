import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import api from "../../services/api";
import type { Permission, Role } from "../../types";

interface User {
  id: string;
  email: string;
  roles: { id: number; name: string; permissions: Permission[] }[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await api.getRoles();
      setRoles(data as Role[]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (user: User) => {};

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data as User[]);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRole =
      roleFilter === "all" ||
      user.roles.some((role) => role.name === roleFilter);
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "danger";
      case "MANAGER":
        return "purple";
      case "CLIENT":
        return "info";
      case "LIVREUR":
        return "success";
      default:
        return "default";
    }
  };

  const handleAssignRoles = (userId: string, assignedRoles: []) => {};

  const columns = [
    {
      key: "user" as string,
      header: "User",
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold">
            {user.email}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              {user.email}
            </p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role" as keyof User,
      header: "Role",
      render: (user: User) =>
        user.roles.map((role) => {
          return (
            <Badge key={role.id} variant={getRoleBadgeVariant(role.name)}>
              {role.name}
            </Badge>
          );
        }),
    },
    {
      key: "status" as keyof User,
      header: "Status",
      render: (user: User) => (
        <Badge variant={user.status === "active" ? "success" : "default"} dot>
          {user.status === "active" ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "createdAt" as keyof User,
      header: "Created",
      render: (user: User) => (
        <span className="text-slate-500">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions" as string,
      header: "Actions",
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenModal(user)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </Button>
          <Button variant="ghost" size="sm">
            <svg
              className="w-4 h-4 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Users Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage users and their roles
          </p>
        </div>
        <Button>
          <svg
            className="w-4 h-4"
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
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
        </div>
        <div className="flex gap-2">
          {["all", "ADMIN", "MANAGER", "CLIENT", "LIVREUR"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === role
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              {role === "all" ? "All" : role}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredUsers}
        keyExtractor={(user) => user.id}
        emptyMessage="No users found."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign Roles To User"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignRoles} isLoading={isSubmitting}>
              Create Role
            </Button>
          </>
        }
      >
        <Input
          label="Role Name"
          placeholder="e.g., SUPERVISOR"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          helperText="Role names should be uppercase (e.g., ADMIN, MANAGER)"
        />
      </Modal>
    </div>
  );
}
