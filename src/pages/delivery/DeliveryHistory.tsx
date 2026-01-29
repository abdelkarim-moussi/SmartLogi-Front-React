import { useState } from 'react';
import Input from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Badge';

// Mock historical data
const deliveryHistory = [
    { id: '1', description: 'Electronics', destination: 'Casablanca', recipient: 'Ahmed K.', status: 'LIVRE', date: '2024-01-15', time: '14:30' },
    { id: '2', description: 'Documents', destination: 'Rabat', recipient: 'Sara M.', status: 'LIVRE', date: '2024-01-15', time: '11:20' },
    { id: '3', description: 'Clothing', destination: 'Casablanca', recipient: 'Omar L.', status: 'LIVRE', date: '2024-01-14', time: '16:45' },
    { id: '4', description: 'Books', destination: 'Fes', recipient: 'Youssef B.', status: 'RETOURNE', date: '2024-01-14', time: '10:00' },
    { id: '5', description: 'Kitchen Items', destination: 'Tangier', recipient: 'Fatima H.', status: 'LIVRE', date: '2024-01-13', time: '15:30' },
    { id: '6', description: 'Fragile Package', destination: 'Agadir', recipient: 'Hassan N.', status: 'LIVRE', date: '2024-01-12', time: '12:15' },
];

export default function DeliveryHistory() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredHistory = deliveryHistory.filter((item) =>
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.recipient.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const deliveredCount = deliveryHistory.filter((h) => h.status === 'LIVRE').length;
    const returnedCount = deliveryHistory.filter((h) => h.status === 'RETOURNE').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Delivery History</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">View your completed deliveries</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
                    <p className="text-emerald-100 text-sm">Delivered</p>
                    <p className="text-3xl font-bold mt-1">{deliveredCount}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
                    <p className="text-amber-100 text-sm">Returned</p>
                    <p className="text-3xl font-bold mt-1">{returnedCount}</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                    <p className="text-indigo-100 text-sm">Success Rate</p>
                    <p className="text-3xl font-bold mt-1">
                        {Math.round((deliveredCount / deliveryHistory.length) * 100)}%
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="max-w-md">
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

            {/* History List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {filteredHistory.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-slate-500">No delivery history found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredHistory.map((item) => (
                            <div
                                key={item.id}
                                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
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
                                            <p className="text-sm text-slate-500">To: {item.recipient}</p>
                                            <p className="text-xs text-slate-400">{item.destination}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <StatusBadge status={item.status} />
                                        <p className="text-sm text-slate-500 mt-1">{item.date}</p>
                                        <p className="text-xs text-slate-400">{item.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
