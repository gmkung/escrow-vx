declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
        };
    }
}

import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function SetupPage() {
    const [setupType, setSetupType] = useState<'escrow' | 'crowdfunding'>('escrow');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [counterpartyAddress, setCounterpartyAddress] = useState('');
    const [terms, setTerms] = useState({
        withdrawalDays: 0,
        cooldownDays: 0,
        refundable: false,
        earlyPayment: false,
        pushPullOptions: false,
    });
    const [targetAmount, setTargetAmount] = useState('');
    const [withdrawalAddresses, setWithdrawalAddresses] = useState<string[]>([]);
    const [withdrawalConditions, setWithdrawalConditions] = useState('');

    const router = useRouter();

    const handleGenerateAddress = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
                const account = accounts[0];

                const message = "This is a test!";
                await window.ethereum.request({
                    method: 'personal_sign',
                    params: [message, account],
                });

                router.push('/my-transactions');
            } catch (error) {
                console.error("Failed to sign message or connect wallet", error);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="flex justify-center p-8">
                <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl bg-white rounded-3xl shadow-lg p-6">
                    <header className="flex justify-between items-center py-4">
                        <h1 className="text-3xl font-bold text-blue-700">Setup {setupType === 'escrow' ? 'Payment Escrow' : 'Crowdfunding'}</h1>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                        >
                            Back to Home
                        </button>
                    </header>

                    <div className="my-4">
                        <label className="block mb-2 text-blue-700">Setup Type:</label>
                        <select
                            value={setupType}
                            onChange={(e) => setSetupType(e.target.value as 'escrow' | 'crowdfunding')}
                            className="border border-blue-300 p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="escrow">Payment Escrow</option>
                            <option value="crowdfunding">Crowdfunding</option>
                        </select>
                    </div>

                    {setupType === 'escrow' ? (
                        <div>
                            <div className="my-4">
                                <label className="block mb-2 text-blue-700">Payment Amount:</label>
                                <input
                                    type="text"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    className="border border-blue-300 p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="my-4">
                                <label className="block mb-2 text-blue-700">Counterparty Address:</label>
                                <input
                                    type="text"
                                    value={counterpartyAddress}
                                    onChange={(e) => setCounterpartyAddress(e.target.value)}
                                    className="border border-blue-300 p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="my-4">
                                <label className="block mb-2 text-blue-700">Terms & Conditions:</label>
                                <input
                                    type="number"
                                    placeholder="Withdrawals possible after X days"
                                    value={terms.withdrawalDays}
                                    onChange={(e) => setTerms({ ...terms, withdrawalDays: parseInt(e.target.value) })}
                                    className="border border-blue-300 p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Payment cooldown period of Y days"
                                    value={terms.cooldownDays}
                                    onChange={(e) => setTerms({ ...terms, cooldownDays: parseInt(e.target.value) })}
                                    className="border border-blue-300 p-3 rounded-full w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="mt-2">
                                    <label className="text-blue-700">
                                        <input
                                            type="checkbox"
                                            checked={terms.refundable}
                                            onChange={(e) => setTerms({ ...terms, refundable: e.target.checked })}
                                            className="mr-2"
                                        />
                                        Refundable?
                                    </label>
                                    <label className="ml-4 text-blue-700">
                                        <input
                                            type="checkbox"
                                            checked={terms.earlyPayment}
                                            onChange={(e) => setTerms({ ...terms, earlyPayment: e.target.checked })}
                                            className="mr-2"
                                        />
                                        Early payment allowed?
                                    </label>
                                    <label className="ml-4 text-blue-700">
                                        <input
                                            type="checkbox"
                                            checked={terms.pushPullOptions}
                                            onChange={(e) => setTerms({ ...terms, pushPullOptions: e.target.checked })}
                                            className="mr-2"
                                        />
                                        Push/pull options for buyer/seller?
                                    </label>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="my-4">
                                <label className="block mb-2 text-blue-700">Target Amount:</label>
                                <input
                                    type="text"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                    className="border border-blue-300 p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="my-4">
                                <label className="block mb-2 text-blue-700">Withdrawal Addresses:</label>
                                {withdrawalAddresses.map((address, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={address}
                                        onChange={(e) => {
                                            const newAddresses = [...withdrawalAddresses];
                                            newAddresses[index] = e.target.value;
                                            setWithdrawalAddresses(newAddresses);
                                        }}
                                        className="border border-blue-300 p-3 rounded-full w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ))}
                                <button
                                    onClick={() => setWithdrawalAddresses([...withdrawalAddresses, ''])}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-full mt-2 hover:bg-blue-700"
                                >
                                    Add Address
                                </button>
                            </div>
                            <div className="my-4">
                                <label className="block mb-2 text-blue-700">Withdrawal Conditions:</label>
                                <input
                                    type="text"
                                    value={withdrawalConditions}
                                    onChange={(e) => setWithdrawalConditions(e.target.value)}
                                    className="border border-blue-300 p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    <div className="my-4">
                        <button
                            onClick={handleGenerateAddress}
                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 w-full"
                        >
                            Generate Single-Use Escrow Contract
                        </button>
                    </div>

                    <aside className="mt-8 bg-blue-100 p-4 rounded-3xl">
                        <h2 className="text-xl font-semibold text-blue-700">Summary</h2>
                        <div className="mt-2 text-blue-700">
                            {setupType === 'escrow' ? (
                                <div>
                                    <p>Payment Amount: {paymentAmount}</p>
                                    <p>Counterparty Address: {counterpartyAddress}</p>
                                    <p>Terms: Withdrawals after {terms.withdrawalDays} days, Cooldown {terms.cooldownDays} days</p>
                                    <p>Refundable: {terms.refundable ? 'Yes' : 'No'}</p>
                                    <p>Early Payment: {terms.earlyPayment ? 'Allowed' : 'Not Allowed'}</p>
                                    <p>Push/Pull Options: {terms.pushPullOptions ? 'Enabled' : 'Disabled'}</p>
                                </div>
                            ) : (
                                <div>
                                    <p>Target Amount: {targetAmount}</p>
                                    <p>Withdrawal Addresses: {withdrawalAddresses.join(', ')}</p>
                                    <p>Withdrawal Conditions: {withdrawalConditions}</p>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
} 