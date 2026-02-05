import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { useToast } from "../../components/ui/Toast";
import api from "../../services/api";
import type { Client } from "../../types";

export default function ClientsManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAllClients();
      setClients(Array.isArray(data) ? (data as Client[]) : []);
    } catch (error) {
      showToast("error", "Failed to fetch clients");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;

    try {
      await api.deleteClient(id);
      showToast("success", "Client deleted successfully");
      fetchClients();
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to delete",
      );
    }
  };

  const filteredClients = clients.filter((c) =>
    `${c.prenom} ${c.nom} ${c.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const columns = [
    {
      key: "client" as string,
      header: "Client",
      render: (client: Client) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
            {client.prenom[0]}
            {client.nom[0]}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              {client.prenom} {client.nom}
            </p>
            <p className="text-sm text-slate-500">{client.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "telephone" as keyof Client,
      header: "Phone",
      render: (client: Client) => (
        <span className="text-slate-600 dark:text-slate-300">
          {client.telephone}
        </span>
      ),
    },
    {
      key: "adresse" as keyof Client,
      header: "Address",
      render: (client: Client) => (
        <span className="text-slate-600 dark:text-slate-300 truncate max-w-xs block">
          {client.adresse}
        </span>
      ),
    },
    {
      key: "status" as string,
      header: "Status",
      render: () => (
        <Badge variant="success" dot>
          Active
        </Badge>
      ),
    },
    {
      key: "actions" as string,
      header: "Actions",
      render: (client: Client) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(client.id)}
          >
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
            Clients
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage registered clients
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search clients..."
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Clients
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {clients.length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Active Today
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">23</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            New This Month
          </p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">12</p>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredClients}
        keyExtractor={(c) => c.id}
        isLoading={isLoading}
        emptyMessage="No clients found."
      />
    </div>
  );
}
