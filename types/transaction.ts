export interface Terms {
    withdrawalDays: number;
    cooldownDays: number;
    refundable: boolean;
    earlyPayment: boolean;
    pushPullOptions: boolean;
    customTerms?: string;
}

export interface Transaction {
    id: string;
    escrowAddress: string;
    terms: Terms;
    status: string;
    date: string;
    amount: string;
    payerAddress: string;
    payeeAddress: string;
    pendingAction?: {
        type: 'refund' | 'payment';
        amount: string;
        requestedBy: string;
    };
} 