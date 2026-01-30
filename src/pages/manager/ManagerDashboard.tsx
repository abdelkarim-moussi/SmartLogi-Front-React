import { useState, useEffect } from 'react';
import { StatsCard } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import api from '../../services/api';
import type { Colis, Livreur, Client } from '../../types';

export default function ManagerDashboard() {
    const [packages, setPackages] = useState<Colis[]>([]);
    const [livreurs, setLivreurs] = useState<Livreur[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const [packagesData, livreursData, clientsData] = await Promise.all([
                api.getAllColis(),
                api.getAllLivreurs(),
                api.getAllClients(),
            ]);
            setPackages(Array.isArray(packagesData) ? packagesData as Colis[] : []);
            setLivreurs(Array.isArray(livreursData) ? livreursData as Livreur[] : []);
            setClients(Array.isArray(clientsData) ? clientsData as Client[] : []);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate stats from real data
    const totalPackages = packages.length;
    const inTransitCount = packages.filter(p => p.status === 'EN_COURS' || p.status === 'IN_TRANSIT').length;
    const deliveredCount = packages.filter(p => p.status === 'LIVRE' || p.status === 'DELIVERED').length;
    const deliveryPersonsCount = livreurs.length;

    // Get recent packages (last 5)
    const recentPackages = packages.slice(0, 5);

    // Calculate status distribution
    const statusCounts = {
        created: packages.filter(p => p.status === 'CREE' || p.status === 'IN_STOCK').length,
        preparation: packages.filter(p => p.status === 'PREPARATION').length,
        inTransit: packages.filter(p => p.status === 'EN_COURS' || p.status === 'IN_TRANSIT').length,
        delivered: packages.filter(p => p.status === 'LIVRE' || p.status === 'DELIVERED').length,
    };
    const totalForPercentage = totalPackages || 1;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manager Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of packages and deliveries</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Packages"
                    value={isLoading ? '...' : totalPackages.toString()}
                    color="indigo"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    }
                />
                <StatsCard
                    title="In Transit"
                    value={isLoading ? '...' : inTransitCount.toString()}
                    color="orange"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17h8M8 17a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 102 0h-2zm-8 0h2m6 0h2M3 13V5a2 2 0 012-2h6l4 4h4a2 2 0 012 2v4" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Delivered"
                    value={isLoading ? '...' : deliveredCount.toString()}
                    color="green"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Delivery Persons"
                    value={isLoading ? '...' : deliveryPersonsCount.toString()}
                    color="purple"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Packages */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Packages</h2>
                        <a href="/manager/packages" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                            View all →
                        </a>
                    </div>
                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : recentPackages.length === 0 ? (
                            <p className="text-center py-8 text-slate-500">No packages found</p>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <th className="pb-3">Package</th>
                                        <th className="pb-3">Destination</th>
                                        <th className="pb-3">Recipient</th>
                                        <th className="pb-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {recentPackages.map((pkg) => (
                                        <tr key={pkg.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="py-3">
                                                <p className="font-medium text-slate-900 dark:text-white">{pkg.description || 'Package'}</p>
                                                <p className="text-xs text-slate-500">#{pkg.id.slice(0, 8)}</p>
                                            </td>
                                            <td className="py-3 text-slate-600 dark:text-slate-300">{pkg.destination}</td>
                                            <td className="py-3 text-slate-600 dark:text-slate-300">
                                                {pkg.destinataire ? `${pkg.destinataire.prenom} ${pkg.destinataire.nom}` : 'N/A'}
                                            </td>
                                            <td className="py-3">
                                                <StatusBadge status={pkg.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Package Status Distribution */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Status Distribution</h2>
                    <div className="space-y-4">
                        {[
                            { status: 'In Stock/Created', count: statusCounts.created, color: 'bg-slate-400', percentage: Math.round((statusCounts.created / totalForPercentage) * 100) },
                            { status: 'In Preparation', count: statusCounts.preparation, color: 'bg-blue-500', percentage: Math.round((statusCounts.preparation / totalForPercentage) * 100) },
                            { status: 'In Transit', count: statusCounts.inTransit, color: 'bg-amber-500', percentage: Math.round((statusCounts.inTransit / totalForPercentage) * 100) },
                            { status: 'Delivered', count: statusCounts.delivered, color: 'bg-emerald-500', percentage: Math.round((statusCounts.delivered / totalForPercentage) * 100) },
                        ].map((item) => (
                            <div key={item.status}>
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-slate-600 dark:text-slate-300">{item.status}</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{item.count}</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Additional Stats */}
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Total Clients</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{clients.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
