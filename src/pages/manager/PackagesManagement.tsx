import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import { StatusBadge, PriorityBadge } from "../../components/ui/Badge";
import { useToast } from "../../components/ui/Toast";
import api from "../../services/api";
import type { Colis, Livreur } from "../../types";

export default function PackagesManagement() {
  const [packages, setPackages] = useState<Colis[]>([]);
  const [livreurs, setLivreurs] = useState<Livreur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Colis | null>(null);
  const [selectedLivreur, setSelectedLivreur] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [packagesData, livreursData] = await Promise.all([
        api.getAllColis(),
        api.getAllLivreurs(),
      ]);

      setPackages(Array.isArray(packagesData) ? (packagesData as Colis[]) : []);
      setLivreurs(
        Array.isArray(livreursData) ? (livreursData as Livreur[]) : [],
      );

      console.log(packages);
    } catch (error) {
      showToast("error", "Failed to fetch data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignLivreur = async () => {
    if (!selectedPackage || !selectedLivreur) {
      showToast("error", "Please select a delivery person");
      return;
    }

    try {
      setIsAssigning(true);
      await api.assignLivreurToColis(selectedPackage.id, selectedLivreur);
      showToast("success", "Delivery person assigned successfully");
      setIsAssignModalOpen(false);
      setSelectedPackage(null);
      setSelectedLivreur("");
      fetchData();
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to assign",
      );
    } finally {
      setIsAssigning(false);
    }
  };

  const handleStatusChange = async (packageId: string, newStatus: string) => {
    try {
      await api.updateColisStatus(packageId, newStatus);
      showToast("success", "Status updated successfully");
      fetchData();
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to update status",
      );
    }
  };

  const openAssignModal = (pkg: Colis) => {
    setSelectedPackage(pkg);
    setSelectedLivreur(pkg.livreur?.id || "");
    setIsAssignModalOpen(true);
  };

  const filteredPackages = packages.filter((pkg) => {
    const destinataireFullName = `${pkg.destinataire?.prenom || ''} ${pkg.destinataire?.nom || ''}`.toLowerCase();
    const matchesSearch =
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destinataireFullName.includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || pkg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: "package" as string,
      header: "Package",
      render: (pkg: Colis) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">
            {pkg.description}
          </p>
          <p className="text-xs text-slate-500">#{pkg.id.slice(0, 8)}</p>
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
          <p className="text-xs text-slate-500">{pkg.destinataire?.adresse}</p>
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
      key: "livreur" as string,
      header: "Assigned To",
      render: (pkg: Colis) =>
        pkg.livreur ? (
          <span className="text-slate-700 dark:text-slate-300">
            {pkg.livreur.prenom} {pkg.livreur.nom}
          </span>
        ) : (
          <span className="text-slate-400 italic">Unassigned</span>
        ),
    },
    {
      key: "actions" as string,
      header: "Actions",
      render: (pkg: Colis) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/manager/packages/${pkg.id}`)}
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openAssignModal(pkg)}
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </Button>
          <select
            className="text-xs border border-slate-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            value={pkg.status}
            onChange={(e) => handleStatusChange(pkg.id, e.target.value)}
          >
            <option value="CREE">Created</option>
            <option value="PREPARATION">Preparation</option>
            <option value="EN_COURS">In Transit</option>
            <option value="LIVRE">Delivered</option>
            <option value="RETOURNE">Returned</option>
            <option value="ANNULE">Cancelled</option>
          </select>
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
            Packages Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage and track all packages
          </p>
        </div>
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
          {["all", "CREE", "PREPARATION", "EN_COURS", "LIVRE"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
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
        emptyMessage="No packages found."
      />

      {/* Assign Livreur Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Delivery Person"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignLivreur} isLoading={isAssigning}>
              Assign
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {selectedPackage && (
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <p className="font-medium text-slate-900 dark:text-white">
                {selectedPackage.description}
              </p>
              <p className="text-sm text-slate-500">
                To: {selectedPackage.destination}
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Select Delivery Person
            </label>
            <select
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              value={selectedLivreur}
              onChange={(e) => setSelectedLivreur(e.target.value)}
            >
              <option value="">Choose a delivery person...</option>
              {livreurs.map((livreur) => (
                <option key={livreur.id} value={livreur.id}>
                  {livreur.prenom} {livreur.nom} - {livreur.vehicule}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
