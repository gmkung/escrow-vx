import { useState } from 'react';

export default function GeneratedSummaryPage() {
    const [generatedAddress, setGeneratedAddress] = useState('0x1234567890abcdef1234567890abcdef12345678');
    const [chainId, setChainId] = useState('Ethereum');
    const [terms, setTerms] = useState('Withdrawals possible after 30 days, Payment cooldown period of 7 days');
    const [recipientAddress, setRecipientAddress] = useState('0xabcdefabcdefabcdefabcdefabcdefabcdef');
    const [refundAddress, setRefundAddress] = useState('0xabcdefabcdefabcdefabcdefabcdefabcdef');

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedAddress);
        alert('Address copied to clipboard!');
    };

    return (
        <div className="bg-blue-50 min-h-screen p-8 flex justify-center">
            <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl bg-white rounded-3xl shadow-lg p-6">
                <header className="flex justify-between items-center py-4">
                    <h1 className="text-3xl font-bold text-blue-700">Generated Summary</h1>
                </header>

                <section className="my-8">
                    <h2 className="text-xl font-semibold text-blue-700">Generated Address</h2>
                    <p className="mt-2 text-blue-700">Address: {generatedAddress}</p>
                    <p className="mt-2 text-blue-700">Chain ID: {chainId}</p>
                    <button
                        onClick={copyToClipboard}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 mt-2"
                    >
                        Copy Address
                    </button>
                </section>

                <section className="my-8">
                    <h2 className="text-xl font-semibold text-blue-700">Terms of Agreement</h2>
                    <p className="mt-2 text-blue-700">{terms}</p>
                </section>

                <section className="my-8">
                    <h2 className="text-xl font-semibold text-blue-700">Recipient and Refund Details</h2>
                    <p className="mt-2 text-blue-700">Recipient Address: {recipientAddress}</p>
                    <p className="mt-2 text-blue-700">Refund Address: {refundAddress}</p>
                </section>

                <section className="my-8">
                    <h2 className="text-xl font-semibold text-blue-700">Share</h2>
                    <div className="flex space-x-4 mt-2">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                            Copy Link to TX
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                            Share on X (Twitter)
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                            Share on Instagram
                        </button>

                    </div>
                </section>

                <div className="my-4 flex justify-between">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                        Back to Home
                    </button>
                    <button
                        onClick={() => window.location.href = '/my-transactions'}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                        View My Transactions
                    </button>
                </div>
            </div>
        </div>
    );
} 