import { StatsCard } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';

// Mock data for recent packages
const recentPackages = [
    { id: '1', description: 'Electronics Package', destination: 'Casablanca', status: 'EN_COURS', client: 'John Doe' },
    { id: '2', description: 'Fashion Items', destination: 'Rabat', status: 'PREPARATION', client: 'Jane Smith' },
    { id: '3', description: 'Food Delivery', destination: 'Marrakech', status: 'CREE', client: 'Ahmed K.' },
    { id: '4', description: 'Documents', destination: 'Fes', status: 'LIVRE', client: 'Maria L.' },
];

export default function ManagerDashboard() {
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
                    value="1,847"
                    color="indigo"
                    trend={{ value: 8, isPositive: true }}
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    }
                />
                <StatsCard
                    title="In Transit"
                    value="234"
                    color="orange"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17h8M8 17a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 102 0h-2zm-8 0h2m6 0h2M3 13V5a2 2 0 012-2h6l4 4h4a2 2 0 012 2v4" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Delivered Today"
                    value="89"
                    color="green"
                    trend={{ value: 12, isPositive: true }}
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Delivery Persons"
                    value="45"
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
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <th className="pb-3">Package</th>
                                    <th className="pb-3">Destination</th>
                                    <th className="pb-3">Client</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {recentPackages.map((pkg) => (
                                    <tr key={pkg.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="py-3">
                                            <p className="font-medium text-slate-900 dark:text-white">{pkg.description}</p>
                                            <p className="text-xs text-slate-500">#{pkg.id}</p>
                                        </td>
                                        <td className="py-3 text-slate-600 dark:text-slate-300">{pkg.destination}</td>
                                        <td className="py-3 text-slate-600 dark:text-slate-300">{pkg.client}</td>
                                        <td className="py-3">
                                            <StatusBadge status={pkg.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Package Status Distribution */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Status Distribution</h2>
                    <div className="space-y-4">
                        {[
                            { status: 'Created', count: 45, color: 'bg-slate-400', percentage: 15 },
                            { status: 'In Preparation', count: 89, color: 'bg-blue-500', percentage: 30 },
                            { status: 'In Transit', count: 124, color: 'bg-amber-500', percentage: 42 },
                            { status: 'Delivered', count: 38, color: 'bg-emerald-500', percentage: 13 },
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
                </div>
            </div>
        </div>
    );
}
