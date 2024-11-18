import { useState } from 'react';
import Navbar from '../components/Navbar';
import TransactionModal, { Transaction } from '../components/TransactionModal';
import { sampleTransactions } from '../data/sampleTransactions';

export default function CommunityCheckerPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const userAddress = '0x123...'; // This should come from your wallet connection

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filteredTransactions = sampleTransactions.filter(transaction =>
        transaction.id.includes(searchQuery) || transaction.escrowAddress.includes(searchQuery)
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="mt-8 flex justify-center">
                <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl bg-white rounded-3xl shadow-lg p-6">
                    <header className="flex justify-between items-center py-4">
                        <h1 className="text-3xl font-bold text-blue-700">Community Checker</h1>
                    </header>

                    <div className="my-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Search transactions or wallet addresses"
                            className="w-full p-3 border border-gray-300 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="my-8 overflow-x-auto">
                        <h2 className="text-xl font-semibold text-blue-700">Pending Transactions</h2>
                        <table className="w-full mt-4">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Transaction ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Escrow Address</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Terms</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredTransactions.map(transaction => (
                                    <tr key={transaction.id}
                                        onClick={() => setSelectedTransaction(transaction)}
                                        className="hover:bg-gray-50 cursor-pointer"
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-blue-600">{transaction.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800 font-mono">{transaction.escrowAddress}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{`${transaction.terms.withdrawalDays} days withdrawal`}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{transaction.status}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            {transaction.status === 'Needs Challenge' ? 'Challenge' : 'Safe to Proceed'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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