import { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
import Table from "../../components/ui/Table";
import { StatusBadge, PriorityBadge } from "../../components/ui/Badge";
import { useToast } from "../../components/ui/Toast";
import api from "../../services/api";
import type { Colis } from "../../types";

export default function MyPackages() {
  const [packages, setPackages] = useState<Colis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { showToast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const data = await api.getMyColis();
      setPackages(data as Colis[]);
    } catch (error) {
      showToast("error", "Failed to fetch packages");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || pkg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: "package" as string,
      header: "Package",
      render: (pkg: Colis) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
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
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              {pkg.description}
            </p>
            <p className="text-xs text-slate-500">#{pkg.id.slice(0, 8)}</p>
          </div>
        </div>
      ),
    },
    {
      key: "destination" as string,
      header: "Destination",
      render: (pkg: Colis) => (
        <div>
          <p className="text-slate-700 dark:text-slate-300">
            {pkg.destination}
          </p>
          <p className="text-xs text-slate-500">{pkg.destination}</p>
        </div>
      ),
    },
    {
      key: "priority" as keyof Colis,
      header: "Priority",
      render: (pkg: Colis) => <PriorityBadge priority={pkg.priority} />,
    },
    {
      key: "status" as keyof Colis,
      header: "Status",
      render: (pkg: Colis) => <StatusBadge status={pkg.status} />,
    },
    {
      key: "date" as string,
      header: "Created",
      render: (pkg: Colis) => (
        <span className="text-slate-500 text-sm">
          {pkg.createdAt ? new Date(pkg.createdAt).toLocaleDateString() : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            My Packages
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track all your package shipments
          </p>
        </div>
        <a
          href="/client/create-package"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          New Package
        </a>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            count: packages.length,
            color: "bg-slate-100 text-slate-700",
          },
          {
            label: "In Transit",
            count: packages.filter((p) => p.status === "EN_COURS").length,
            color: "bg-amber-100 text-amber-700",
          },
          {
            label: "Delivered",
            count: packages.filter((p) => p.status === "LIVRE").length,
            color: "bg-emerald-100 text-emerald-700",
          },
          {
            label: "Pending",
            count: packages.filter((p) =>
              ["CREE", "PREPARATION"].includes(p.status),
            ).length,
            color: "bg-blue-100 text-blue-700",
          },
        ].map((stat) => (
          <div key={stat.label} className={`p-4 rounded-xl ${stat.color}`}>
            <p className="text-2xl font-bold">{stat.count}</p>
            <p className="text-sm opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search packages..."
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
        <div className="flex gap-2 flex-wrap">
          {[
            "all",
            "CREATED",
            "COLLECTED",
            "IN_TRANSIT",
            "DELIVERED",
            "IN_STOCK",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {status === "all" ? "All" : status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredPackages}
        keyExtractor={(pkg) => pkg.id}
        isLoading={isLoading}
        emptyMessage="No packages found. Create your first package!"
      />
    </div>
  );
}
