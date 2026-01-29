import { StatsCard } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';

// Mock data for assigned packages
const assignedPackages = [
    { id: '1', description: 'Electronics', destination: 'Casablanca', address: '123 Main St', status: 'EN_COURS', priority: 'EXPRESS' },
    { id: '2', description: 'Documents', destination: 'Rabat', address: '456 Oak Ave', status: 'PREPARATION', priority: 'NORMAL' },
    { id: '3', description: 'Clothing', destination: 'Casablanca', address: '789 Pine Rd', status: 'EN_COURS', priority: 'NORMAL' },
];

export default function DeliveryDashboard() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Delivery Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your deliveries</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Today's Deliveries"
                    value="8"
                    color="indigo"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    }
                />
                <StatsCard
                    title="In Progress"
                    value="3"
                    color="orange"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Completed Today"
                    value="5"
                    color="green"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="This Week"
                    value="42"
                    color="purple"
                    trend={{ value: 15, isPositive: true }}
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    }
                />
            </div>

            {/* Assigned Packages */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Assigned Packages</h2>
                        <a href="/delivery/packages" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                            View all →
                        </a>
                    </div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {assignedPackages.map((pkg) => (
                        <div key={pkg.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${pkg.priority === 'EXPRESS'
                                            ? 'bg-red-100 dark:bg-red-900/30'
                                            : 'bg-indigo-100 dark:bg-indigo-900/30'
                                        }`}>
                                        {pkg.priority === 'EXPRESS' ? (
                                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">{pkg.description}</p>
                                        <p className="text-sm text-slate-500">{pkg.address}</p>
                                        <p className="text-xs text-slate-400">{pkg.destination}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <StatusBadge status={pkg.status} />
                                    <a
                                        href={`/delivery/packages/${pkg.id}`}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                        Deliver
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a
                    href="/delivery/packages"
                    className="flex items-center gap-4 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold">View All Packages</h3>
                        <p className="text-indigo-100 text-sm">See all assigned deliveries</p>
                    </div>
                </a>
                <a
                    href="/delivery/history"
                    className="flex items-center gap-4 p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
                >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold">Delivery History</h3>
                        <p className="text-emerald-100 text-sm">View past deliveries</p>
                    </div>
                </a>
            </div>
        </div>
    );
}
