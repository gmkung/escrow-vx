import { Transaction } from '../types/transaction';

export const sampleTransactions: Transaction[] = [
    {
        id: 'tx123',
        escrowAddress: '0x1abc45def...',
        terms: {
            withdrawalDays: 30,
            cooldownDays: 5,
            refundable: true,
            earlyPayment: false,
            pushPullOptions: true,
            customTerms: "Delivery expected within 30 days. Must include source code and documentation."
        },
        status: 'Ongoing',
        date: '2024-03-01',
        amount: '1.5',
        payerAddress: '0x123...',
        payeeAddress: '0x456...'
    },
    {
        id: 'tx456',
        escrowAddress: '0x2def89abc...',
        terms: {
            withdrawalDays: 7,
            cooldownDays: 2,
            refundable: true,
            earlyPayment: true,
            pushPullOptions: true,
            customTerms: "Code review and repository transfer required before final payment"
        },
        status: 'Payment Requested',
        date: '2024-03-02',
        amount: '2.0',
        payerAddress: '0x789...',
        payeeAddress: '0xabc...',
        pendingAction: {
            type: 'payment',
            amount: '1.0',
            requestedBy: '0xabc...'
        }
    },
    {
        id: 'tx789',
        escrowAddress: '0x3ghi67jkl...',
        terms: {
            withdrawalDays: 14,
            cooldownDays: 3,
            refundable: true,
            earlyPayment: false,
            pushPullOptions: false,
            customTerms: "Website deployment must be complete and functional"
        },
        status: 'Refund Requested',
        date: '2024-03-03',
        amount: '3.5',
        payerAddress: '0xdef...',
        payeeAddress: '0xghi...'
    },
    {
        id: 'tx101',
        escrowAddress: '0x4mno12pqr...',
        terms: {
            withdrawalDays: 60,
            cooldownDays: 10,
            refundable: true,
            earlyPayment: true,
            pushPullOptions: true,
            customTerms: "Mobile app development with monthly milestone reviews"
        },
        status: 'Completed',
        date: '2024-03-04',
        amount: '10.0',
        payerAddress: '0xjkl...',
        payeeAddress: '0xmno...'
    }
]; 