import { FC } from 'react';
import { Transaction } from '../types/transaction';

interface TransactionModalProps {
    transaction: Transaction;
    onClose: () => void;
    userAddress: string;
}

const TransactionModal: FC<TransactionModalProps> = ({ transaction, onClose, userAddress }) => {
    const isPayer = userAddress === transaction.payerAddress;
    const isPayee = userAddress === transaction.payeeAddress;

    const handlePushPayment = async () => {
        try {
            // Add contract interaction logic here
            console.log('Pushing payment for transaction:', transaction.id);
            // Example: await contract.pushPayment(transaction.id);
            onClose();
        } catch (error) {
            console.error('Error pushing payment:', error);
        }
    };

    const handleRequestRefund = async () => {
        try {
            console.log('Requesting refund for transaction:', transaction.id);
            // Example: await contract.requestRefund(transaction.id);
            onClose();
        } catch (error) {
            console.error('Error requesting refund:', error);
        }
    };

    const handleRequestPayment = async () => {
        try {
            console.log('Requesting payment for transaction:', transaction.id);
            // Example: await contract.requestPayment(transaction.id);
            onClose();
        } catch (error) {
            console.error('Error requesting payment:', error);
        }
    };

    const handlePushRefund = async () => {
        try {
            console.log('Pushing refund for transaction:', transaction.id);
            // Example: await contract.pushRefund(transaction.id);
            onClose();
        } catch (error) {
            console.error('Error pushing refund:', error);
        }
    };

    const handleDispute = async () => {
        try {
            console.log('Disputing transaction:', transaction.id);
            // Example: await contract.dispute(transaction.id);
            onClose();
        } catch (error) {
            console.error('Error disputing transaction:', error);
        }
    };

    const renderActionButtons = () => {
        if (transaction.status === 'Refund Requested' || transaction.status === 'Payment Requested') {
            return (
                <div className="space-x-4">
                    <button 
                        onClick={handleDispute}
                        className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
                    >
                        Challenge Request
                    </button>
                </div>
            );
        }

        if (transaction.status === 'Ongoing') {
            if (isPayer) {
                return (
                    <div className="space-x-4">
                        <button 
                            onClick={handlePushPayment}
                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                        >
                            Push Payment
                        </button>
                        {transaction.terms.refundable && (
                            <button 
                                onClick={handleRequestRefund}
                                className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700"
                            >
                                Request Refund
                            </button>
                        )}
                    </div>
                );
            }

            if (isPayee) {
                return (
                    <div className="space-x-4">
                        <button 
                            onClick={handleRequestPayment}
                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                        >
                            Request Payment
                        </button>
                        {transaction.terms.refundable && (
                            <button 
                                onClick={handlePushRefund}
                                className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700"
                            >
                                Push Refund
                            </button>
                        )}
                    </div>
                );
            }
        }

        return null;
    };

    const generateTransactionText = () => {
        const date = new Date(transaction.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
TRANSACTION AGREEMENT
Transaction ID: ${transaction.id}
Date: ${date}
Status: ${transaction.status}

PARTIES INVOLVED:
Payer: ${transaction.payerAddress}
Payee: ${transaction.payeeAddress}
Smart Contract: ${transaction.escrowAddress}

FINANCIAL TERMS:
Amount in Escrow: ${transaction.amount} ETH

AGREEMENT TERMS:
1. TIME CONSTRAINTS
   - Withdrawal Period: ${transaction.terms.withdrawalDays} days
   - Cooldown Period: ${transaction.terms.cooldownDays} days

2. PAYMENT CONDITIONS
   - Refundable: ${transaction.terms.refundable ? 'Yes' : 'No'}
   - Early Payment: ${transaction.terms.earlyPayment ? 'Allowed' : 'Not Allowed'}
   - Push/Pull Options: ${transaction.terms.pushPullOptions ? 'Enabled' : 'Disabled'}

3. CUSTOM TERMS AND CONDITIONS
${transaction.terms.customTerms || 'No custom terms specified.'}

${transaction.pendingAction ? `
4. PENDING ACTIONS
   Type: ${transaction.pendingAction.type}
   Amount: ${transaction.pendingAction.amount} ETH
   Requested By: ${transaction.pendingAction.requestedBy}
` : ''}

This agreement is enforced through smart contract ${transaction.escrowAddress}
        `;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-3xl w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-blue-700">Transaction Details</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-700 hover:text-gray-800"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Prose Format Display */}
                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-gray-50 p-6 rounded-xl overflow-auto max-h-[calc(100vh-20rem)]">
                        {generateTransactionText()}
                    </pre>

                    {/* Pending Action Alert */}
                    {transaction.pendingAction && (
                        <div className="bg-yellow-50 p-4 rounded-xl">
                            <p className="font-semibold text-yellow-700">
                                Pending {transaction.pendingAction.type}: {transaction.pendingAction.amount} ETH
                            </p>
                            {((isPayer && transaction.pendingAction.requestedBy !== transaction.payerAddress) ||
                              (isPayee && transaction.pendingAction.requestedBy !== transaction.payeeAddress)) && (
                                <button 
                                    onClick={handleDispute}
                                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
                                >
                                    Dispute {transaction.pendingAction.type}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="border-t pt-4">
                        {renderActionButtons()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionModal; 