import { StatsCard } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';

// Mock data
const myPackages = [
    { id: '1', description: 'Electronics', destination: 'Casablanca', status: 'EN_COURS', date: '2024-01-15' },
    { id: '2', description: 'Documents', destination: 'Rabat', status: 'LIVRE', date: '2024-01-10' },
    { id: '3', description: 'Clothing', destination: 'Marrakech', status: 'PREPARATION', date: '2024-01-18' },
];

export default function ClientDashboard() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Track your packages and shipments</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Packages"
                    value="24"
                    color="indigo"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    }
                />
                <StatsCard
                    title="In Transit"
                    value="3"
                    color="orange"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17h8M8 17a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 102 0h-2zm-8 0h2m6 0h2" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Delivered"
                    value="18"
                    color="green"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Pending"
                    value="3"
                    color="purple"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Quick Action */}
            <a
                href="/client/create-package"
                className="block p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Create New Package</h3>
                        <p className="text-indigo-100 mt-1">Send a new package delivery request</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                </div>
            </a>

            {/* Recent Packages */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Packages</h2>
                    <a href="/client/packages" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                        View all →
                    </a>
                </div>
                <div className="space-y-4">
                    {myPackages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">{pkg.description}</p>
                                    <p className="text-sm text-slate-500">To: {pkg.destination}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-500">{pkg.date}</span>
                                <StatusBadge status={pkg.status} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tracking Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Package Status Overview</h2>
                    <div className="space-y-3">
                        {[
                            { label: 'Created', count: 3, color: 'bg-slate-400' },
                            { label: 'In Preparation', count: 2, color: 'bg-blue-500' },
                            { label: 'In Transit', count: 3, color: 'bg-amber-500' },
                            { label: 'Delivered', count: 18, color: 'bg-emerald-500' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                    <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                                </div>
                                <span className="font-semibold text-slate-900 dark:text-white">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Links</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'New Package', icon: '📦', href: '/client/create-package' },
                            { label: 'My Packages', icon: '📋', href: '/client/packages' },
                            { label: 'History', icon: '📜', href: '/client/history' },
                            { label: 'Support', icon: '💬', href: '#support' },
                        ].map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
