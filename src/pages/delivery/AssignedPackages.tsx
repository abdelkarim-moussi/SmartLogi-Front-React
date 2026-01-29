import { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import api from '../../services/api';
import type { Colis } from '../../types';

export default function AssignedPackages() {
    const [packages, setPackages] = useState<Colis[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<Colis | null>(null);
    const [newStatus, setNewStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
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
            showToast('error', 'Failed to fetch packages');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const openStatusModal = (pkg: Colis) => {
        setSelectedPackage(pkg);
        setNewStatus(pkg.status);
        setIsStatusModalOpen(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedPackage || !newStatus) return;

        try {
            setIsUpdating(true);
            await api.updateColisStatus(selectedPackage.id, newStatus);
            showToast('success', 'Status updated successfully');
            setIsStatusModalOpen(false);
            fetchPackages();
        } catch (error) {
            showToast('error', error instanceof Error ? error.message : 'Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredPackages = packages.filter((pkg) =>
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.villeDestination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destinataire.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activePackages = filteredPackages.filter((p) => !['LIVRE', 'RETOURNE', 'ANNULE'].includes(p.status));

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Assigned Packages</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your deliveries</p>
            </div>

            {/* Search */}
            <div className="max-w-md">
                <Input
                    placeholder="Search packages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-amber-600">{activePackages.length}</p>
                    <p className="text-sm text-amber-600/80">Pending</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600">
                        {packages.filter((p) => p.status === 'EN_COURS').length}
                    </p>
                    <p className="text-sm text-blue-600/80">In Transit</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-emerald-600">
                        {packages.filter((p) => p.status === 'LIVRE').length}
                    </p>
                    <p className="text-sm text-emerald-600/80">Delivered</p>
                </div>
            </div>

            {/* Packages List */}
            {activePackages.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                    <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-slate-500">All caught up! No pending deliveries.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {activePackages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${pkg.priority === 'EXPRESS'
                                        ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white'
                                        : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                                        }`}>
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-slate-900 dark:text-white">{pkg.description}</h3>
                                            <PriorityBadge priority={pkg.priority} />
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                            <strong>To:</strong> {pkg.destinataire}
                                        </p>
                                        <p className="text-sm text-slate-500">{pkg.adresse}</p>
                                        <p className="text-sm text-slate-500">{pkg.villeDestination}</p>
                                        <p className="text-xs text-slate-400 mt-1">Weight: {pkg.poids}kg</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <StatusBadge status={pkg.status} />
                                    <Button size="sm" onClick={() => openStatusModal(pkg)}>
                                        Update Status
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Status Update Modal */}
            <Modal
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                title="Update Delivery Status"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsStatusModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateStatus} isLoading={isUpdating}>
                            Update Status
                        </Button>
                    </>
                }
            >
                {selectedPackage && (
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <p className="font-medium text-slate-900 dark:text-white">{selectedPackage.description}</p>
                            <p className="text-sm text-slate-500">To: {selectedPackage.destinataire}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                New Status
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { value: 'PREPARATION', label: 'In Preparation', color: 'border-blue-500 bg-blue-50' },
                                    { value: 'EN_COURS', label: 'In Transit', color: 'border-amber-500 bg-amber-50' },
                                    { value: 'LIVRE', label: 'Delivered', color: 'border-emerald-500 bg-emerald-50' },
                                    { value: 'RETOURNE', label: 'Returned', color: 'border-purple-500 bg-purple-50' },
                                ].map((status) => (
                                    <button
                                        key={status.value}
                                        onClick={() => setNewStatus(status.value)}
                                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${newStatus === status.value
                                            ? status.color
                                            : 'border-slate-200 hover:border-slate-300 dark:border-slate-600'
                                            }`}
                                    >
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
