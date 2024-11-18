declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
        };
    }
}

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { Transaction } from '../types/transaction';

// Add type for setup type
type SetupType = 'escrow' | 'crowdfund';

const PolicyPreview: React.FC<{
    transaction: Partial<Transaction>;
    setupType: SetupType;
}> = ({ transaction, setupType }) => {
    const [policyText, setPolicyText] = useState('');

    useEffect(() => {
        const generatePolicyText = () => {
            const date = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            if (setupType === 'escrow') {
                return `
ESCROW AGREEMENT
Date: ${date}

This Escrow Agreement ("Agreement") is entered into by:
Payer: ${transaction.payerAddress || '[WALLET ADDRESS PENDING]'}
Payee: ${transaction.payeeAddress || '[RECIPIENT ADDRESS PENDING]'}
Amount: ${transaction.amount || '[AMOUNT PENDING]'} ETH

TERMS AND CONDITIONS:

1. PAYMENT TERMS
   - Total Amount in Escrow: ${transaction.amount || '[AMOUNT PENDING]'} ETH
   - Withdrawal Period: ${transaction.terms?.withdrawalDays || '[PENDING]'} days
   - Cooldown Period: ${transaction.terms?.cooldownDays || '[PENDING]'} days

2. SPECIAL CONDITIONS
   - Refundable: ${transaction.terms?.refundable ? 'Yes' : 'No'}
   - Early Payment: ${transaction.terms?.earlyPayment ? 'Allowed' : 'Not Allowed'}
   - Push/Pull Options: ${transaction.terms?.pushPullOptions ? 'Enabled' : 'Disabled'}

3. CUSTOM TERMS
${transaction.terms?.customTerms || '[PENDING CUSTOM TERMS]'}

4. SMART CONTRACT ADDRESS
${transaction.escrowAddress || '[PENDING CONTRACT DEPLOYMENT]'}

This agreement is automatically enforced through blockchain technology.
                `;
            } else {
                return `
CROWDFUNDING CAMPAIGN AGREEMENT
Date: ${date}

CAMPAIGN DETAILS:
Creator: ${transaction.payerAddress || '[WALLET ADDRESS PENDING]'}
Funding Goal: ${transaction.amount || '[AMOUNT PENDING]'} ETH

TERMS AND CONDITIONS:

1. CAMPAIGN STRUCTURE
   - Campaign Duration: ${transaction.terms?.withdrawalDays || '[PENDING]'} days
   - Minimum Contribution: ${transaction.terms?.cooldownDays || '[PENDING]'} ETH
   - Goal Amount: ${transaction.amount || '[AMOUNT PENDING]'} ETH

2. FUNDING TERMS
   - Refundable if Goal Not Met: ${transaction.terms?.refundable ? 'Yes' : 'No'}
   - Early Withdrawal: ${transaction.terms?.earlyPayment ? 'Allowed' : 'Not Allowed'}

3. CAMPAIGN DESCRIPTION AND TERMS
${transaction.terms?.customTerms || '[PENDING DESCRIPTION]'}

4. SMART CONTRACT ADDRESS
${transaction.escrowAddress || '[PENDING CONTRACT DEPLOYMENT]'}

This campaign is automatically managed through blockchain technology.
                `;
            }
        };

        setPolicyText(generatePolicyText());
    }, [transaction, setupType]);

    return (
        <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Generated Agreement Preview</h2>
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-gray-50 p-6 rounded-xl overflow-auto max-h-[calc(100vh-16rem)]">
                {policyText}
            </pre>
        </div>
    );
};

export default function SetupPage() {
    const [setupType, setSetupType] = useState<SetupType>('escrow');
    const [transaction, setTransaction] = useState<Partial<Transaction>>({
        terms: {
            withdrawalDays: 0,
            cooldownDays: 0,
            refundable: false,
            earlyPayment: false,
            pushPullOptions: false,
            customTerms: ''
        },
        amount: '',
        payerAddress: '',
        payeeAddress: '',
        status: 'Ongoing',
        date: new Date().toISOString().split('T')[0]
    });

    const router = useRouter();

    const handleGenerateAddress = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
                const account = accounts[0];

                // Set payer address as the connected wallet
                setTransaction(prev => ({
                    ...prev,
                    payerAddress: account,
                    id: `tx${Date.now()}`, // Generate a unique ID
                    escrowAddress: `0x${Math.random().toString(16).slice(2)}...` // Placeholder for actual contract address
                }));

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
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-1/2">
                            <div className="bg-white rounded-3xl shadow-lg p-6">
                                <header className="flex justify-between items-center py-4">
                                    <h1 className="text-3xl font-bold text-blue-700">
                                        Setup {setupType === 'escrow' ? 'Payment Escrow' : 'Crowdfunding'}
                                    </h1>
                                </header>

                                <div className="my-4">
                                    <label className="block mb-2 text-blue-700">Setup Type:</label>
                                    <select
                                        value={setupType}
                                        onChange={(e) => setSetupType(e.target.value as SetupType)}
                                        className="border border-blue-300 p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    >
                                        <option value="escrow">Payment Escrow</option>
                                        <option value="crowdfund">Crowdfunding</option>
                                    </select>
                                </div>

                                <div className="my-4">
                                    <label className="block mb-2 text-blue-700">
                                        {setupType === 'escrow' ? 'Payment Amount (ETH):' : 'Funding Goal (ETH):'}
                                    </label>
                                    <input
                                        type="text"
                                        value={transaction.amount}
                                        onChange={(e) => setTransaction(prev => ({ ...prev, amount: e.target.value }))}
                                        className="border border-blue-300 p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                        placeholder={setupType === 'escrow' ? "Enter amount in ETH" : "Enter funding goal in ETH"}
                                    />
                                </div>

                                {setupType === 'escrow' && (
                                    <div className="my-4">
                                        <label className="block mb-2 text-blue-700">Payee Address:</label>
                                        <input
                                            type="text"
                                            value={transaction.payeeAddress}
                                            onChange={(e) => setTransaction(prev => ({ ...prev, payeeAddress: e.target.value }))}
                                            className="border border-blue-300 p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                            placeholder="Enter recipient's wallet address"
                                        />
                                    </div>
                                )}

                                <div className="my-4">
                                    <label className="block mb-2 text-blue-700">Terms & Conditions:</label>
                                    {setupType === 'escrow' ? (
                                        <>
                                            <input
                                                type="number"
                                                placeholder="Withdrawals possible after X days"
                                                value={transaction.terms?.withdrawalDays || ''}
                                                onChange={(e) => setTransaction(prev => ({
                                                    ...prev,
                                                    terms: {
                                                        ...prev.terms!,
                                                        withdrawalDays: e.target.value === '' ? 0 : parseInt(e.target.value)
                                                    }
                                                }))}
                                                className="border border-blue-300 p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Payment cooldown period of Y days"
                                                value={transaction.terms?.cooldownDays || ''}
                                                onChange={(e) => setTransaction(prev => ({
                                                    ...prev,
                                                    terms: {
                                                        ...prev.terms!,
                                                        cooldownDays: e.target.value === '' ? 0 : parseInt(e.target.value)
                                                    }
                                                }))}
                                                className="border border-blue-300 p-3 rounded-full w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                type="number"
                                                placeholder="Campaign duration in days"
                                                value={transaction.terms?.withdrawalDays ? '' : transaction.terms?.withdrawalDays}
                                                onChange={(e) => setTransaction(prev => ({
                                                    ...prev,
                                                    terms: {
                                                        ...prev.terms!,
                                                        withdrawalDays: e.target.value === '' ? 0 : parseInt(e.target.value)
                                                    }
                                                }))}
                                                className="border border-blue-300 p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Minimum contribution amount (ETH)"
                                                value={transaction.terms?.cooldownDays ? '' : transaction.terms?.cooldownDays}
                                                onChange={(e) => setTransaction(prev => ({
                                                    ...prev,
                                                    terms: {
                                                        ...prev.terms!,
                                                        cooldownDays: e.target.value === '' ? 0 : parseInt(e.target.value)
                                                    }
                                                }))}
                                                className="border border-blue-300 p-3 rounded-full w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                            />
                                        </>
                                    )}

                                    <textarea
                                        placeholder={setupType === 'escrow' ?
                                            "Custom terms and conditions" :
                                            "Campaign description and terms"
                                        }
                                        value={transaction.terms?.customTerms}
                                        onChange={(e) => setTransaction(prev => ({
                                            ...prev,
                                            terms: { ...prev.terms!, customTerms: e.target.value }
                                        }))}
                                        className="border border-blue-300 p-3 rounded-xl w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                        rows={3}
                                    />

                                    <div className="mt-2">
                                        {setupType === 'escrow' ? (
                                            <>
                                                <label className="text-blue-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={transaction.terms?.refundable}
                                                        onChange={(e) => setTransaction(prev => ({
                                                            ...prev,
                                                            terms: { ...prev.terms!, refundable: e.target.checked }
                                                        }))}
                                                        className="mr-2"
                                                    />
                                                    Refundable?
                                                </label>
                                                <label className="ml-4 text-blue-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={transaction.terms?.earlyPayment}
                                                        onChange={(e) => setTransaction(prev => ({
                                                            ...prev,
                                                            terms: { ...prev.terms!, earlyPayment: e.target.checked }
                                                        }))}
                                                        className="mr-2"
                                                    />
                                                    Early payment allowed?
                                                </label>
                                                <label className="ml-4 text-blue-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={transaction.terms?.pushPullOptions}
                                                        onChange={(e) => setTransaction(prev => ({
                                                            ...prev,
                                                            terms: { ...prev.terms!, pushPullOptions: e.target.checked }
                                                        }))}
                                                        className="mr-2"
                                                    />
                                                    Push/pull options?
                                                </label>
                                            </>
                                        ) : (
                                            <>
                                                <label className="text-blue-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={transaction.terms?.refundable}
                                                        onChange={(e) => setTransaction(prev => ({
                                                            ...prev,
                                                            terms: { ...prev.terms!, refundable: e.target.checked }
                                                        }))}
                                                        className="mr-2"
                                                    />
                                                    Refundable if goal not met?
                                                </label>
                                                <label className="ml-4 text-blue-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={transaction.terms?.earlyPayment}
                                                        onChange={(e) => setTransaction(prev => ({
                                                            ...prev,
                                                            terms: { ...prev.terms!, earlyPayment: e.target.checked }
                                                        }))}
                                                        className="mr-2"
                                                    />
                                                    Allow early withdrawal?
                                                </label>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button
                                        onClick={handleGenerateAddress}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 w-full"
                                    >
                                        Generate {setupType === 'escrow' ? 'Escrow Contract' : 'Crowdfunding Campaign'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2">
                            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-8">
                                <PolicyPreview
                                    transaction={transaction}
                                    setupType={setupType}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 