import { useState } from 'react';
import Input from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Badge';

// Mock historical data
const historyData = [
    { id: '1', description: 'Electronics Package', destination: 'Casablanca', status: 'LIVRE', deliveryDate: '2024-01-10', deliveredBy: 'Ahmed M.' },
    { id: '2', description: 'Documents', destination: 'Rabat', status: 'LIVRE', deliveryDate: '2024-01-08', deliveredBy: 'Fatima K.' },
    { id: '3', description: 'Fashion Items', destination: 'Marrakech', status: 'LIVRE', deliveryDate: '2024-01-05', deliveredBy: 'Omar L.' },
    { id: '4', description: 'Books', destination: 'Fes', status: 'RETOURNE', deliveryDate: '2024-01-03', deliveredBy: 'Youssef B.' },
    { id: '5', description: 'Kitchen Equipment', destination: 'Tangier', status: 'LIVRE', deliveryDate: '2023-12-28', deliveredBy: 'Ahmed M.' },
    { id: '6', description: 'Fragile Items', destination: 'Agadir', status: 'LIVRE', deliveryDate: '2023-12-20', deliveredBy: 'Sara H.' },
];

export default function PackageHistory() {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<string>('all');

    const filteredHistory = historyData.filter((item) => {
        const matchesSearch =
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.destination.toLowerCase().includes(searchQuery.toLowerCase());

        if (dateFilter === 'all') return matchesSearch;

        const itemDate = new Date(item.deliveryDate);
        const now = new Date();

        if (dateFilter === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return matchesSearch && itemDate >= weekAgo;
        }
        if (dateFilter === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return matchesSearch && itemDate >= monthAgo;
        }

        return matchesSearch;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Package History</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">View your completed deliveries</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
                    <p className="text-emerald-100 text-sm">Total Delivered</p>
                    <p className="text-3xl font-bold mt-1">{historyData.filter((h) => h.status === 'LIVRE').length}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
                    <p className="text-amber-100 text-sm">Returned</p>
                    <p className="text-3xl font-bold mt-1">{historyData.filter((h) => h.status === 'RETOURNE').length}</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                    <p className="text-indigo-100 text-sm">Success Rate</p>
                    <p className="text-3xl font-bold mt-1">
                        {Math.round((historyData.filter((h) => h.status === 'LIVRE').length / historyData.length) * 100)}%
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 max-w-md">
                    <Input
                        placeholder="Search history..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        }
                    />
                </div>
                <div className="flex gap-2">
                    {[
                        { value: 'all', label: 'All Time' },
                        { value: 'week', label: 'This Week' },
                        { value: 'month', label: 'This Month' },
                    ].map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setDateFilter(filter.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dateFilter === filter.value
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* History List */}
            <div className="space-y-4">
                {filteredHistory.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                        <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-slate-500">No delivery history found</p>
                    </div>
                ) : (
                    filteredHistory.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.status === 'LIVRE'
                                            ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                            : 'bg-amber-100 dark:bg-amber-900/30'
                                        }`}>
                                        {item.status === 'LIVRE' ? (
                                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">{item.description}</p>
                                        <p className="text-sm text-slate-500">To: {item.destination}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <StatusBadge status={item.status} />
                                    <p className="text-xs text-slate-500 mt-1">{item.deliveryDate}</p>
                                    <p className="text-xs text-slate-400">by {item.deliveredBy}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
