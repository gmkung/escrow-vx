import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TransactionModal, { Transaction } from '../components/TransactionModal';
import { sampleTransactions } from '../data/sampleTransactions';

export default function MyTransactionsPage() {
    const [filterStatus, setFilterStatus] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [userAddress, setUserAddress] = useState<string>('');

    const transactions = sampleTransactions;

    const filteredTransactions = transactions.filter(transaction => {
        const matchesStatus = filterStatus === 'all' || transaction.status.toLowerCase() === filterStatus;
        const matchesDate = (!dateRange.start || new Date(transaction.date) >= new Date(dateRange.start)) &&
                            (!dateRange.end || new Date(transaction.date) <= new Date(dateRange.end));
        return matchesStatus && matchesDate;
    });

    useEffect(() => {
        const getUserAddress = async () => {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setUserAddress(accounts[0]);
            }
        };
        getUserAddress();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="p-8 flex justify-center">
                <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl bg-white rounded-3xl shadow-lg p-6">
                    <header className="flex justify-between items-center py-4">
                        <h1 className="text-3xl font-bold text-blue-700">My Transactions</h1>
                    </header>

                    <div className="my-4">
                        <label className="block mb-2 text-blue-700">Filter by Status:</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="border border-blue-300 p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>

                    <div className="my-4">
                        <label className="block mb-2 text-blue-700">Filter by Date Range:</label>
                        <div className="flex space-x-4">
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="border border-blue-300 p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="border border-blue-300 p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="my-8 overflow-x-auto">
                        <h2 className="text-xl font-semibold text-blue-700">Transactions</h2>
                        {filteredTransactions.length > 0 ? (
                            <table className="w-full mt-4">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Transaction ID</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Status</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredTransactions.map(transaction => (
                                        <tr 
                                            key={transaction.id} 
                                            onClick={() => setSelectedTransaction(transaction)}
                                            className="hover:bg-gray-50 cursor-pointer"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-blue-600">{transaction.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{transaction.status}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{transaction.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-800">No transactions found.</p>
                        )}
                    </div>

                    {selectedTransaction && (
                        <TransactionModal 
                            transaction={selectedTransaction}
                            onClose={() => setSelectedTransaction(null)}
                            userAddress={userAddress}
                        />
                    )}
                </div>
            </div>
        </div>
    );
} 