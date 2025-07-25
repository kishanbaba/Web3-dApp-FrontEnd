import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type HistoryItem = {
    message: string;
    signature: string;
    verified: boolean | null;
    signer: string | null;
};

export const WalletActions = () => {
    const { primaryWallet } = useDynamicContext();
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const historyFromStorage = localStorage.getItem('signHistory');
        const initialHistory: HistoryItem[] = historyFromStorage ? JSON.parse(historyFromStorage) : [];
        setHistory(initialHistory);
    }, []);

    const handleSign = async () => {
        if (!primaryWallet || !message) return;

        setIsLoading(true);
        try {
            const signature = await primaryWallet.signMessage(message);
            const response = await axios.post('https://web3dapp-backend.onrender.com/api/v1/signature/verify', {
                message,
                signature: signature,
            });

            const { isValid, signer } = response.data;
            const newHistoryItem: HistoryItem = {
                message,
                signature: signature ?? '',
                verified: isValid,
                signer,
            };

            const updatedHistory = [newHistoryItem, ...history];
            setHistory(updatedHistory);
            localStorage.setItem('signHistory', JSON.stringify(updatedHistory));
            setMessage('');
        } catch (error) {
            console.error('Signing error:', error);
            // In a real app, show a toast notification
            alert('Failed to Sign/Verify the message.');
        } finally {
            setIsLoading(false);
        }
    };

    const address = primaryWallet?.address;

    return (
        <div className='flex flex-col md:flex-row justify-center gap-8 w-full mt-2 md:mt-4'>
            <Card title="Sign a Message" className="w-full max-w-2xl">
                <div className='flex flex-col gap-4'>
                    <p className="text-sm">Connected Wallet: <strong className="font-mono text-indigo-400 break-all">{address}</strong></p>
                    <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message here to sign..."
                        className="block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Button onClick={handleSign} disabled={!message || isLoading} className="w-full sm:w-auto self-end">
                        {isLoading ? 'Signing...' : 'Sign Message'}
                    </Button>
                </div>
            </Card>

            {history.length > 0 && (
                <Card title="Signature History" className="w-full max-w-2xl">
                    <ul className="space-y-6 h-[420px] overflow-auto">
                        {history.map((item, index) => (
                            <li key={index} className="p-4 bg-gray-900/50 rounded-lg break-words">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                                    <p className="text-lg font-semibold">{index + 1}. {item.message}</p>
                                    <span className={`px-3 py-1 text-sm font-bold rounded-full whitespace-nowrap ${item.verified ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {item.verified ? '✅ Valid' : '❌ Invalid'}
                                    </span>
                                </div>
                                <div className="mt-3">
                                    <p className="text-xs text-gray-400">Signer:</p>
                                    <p className="font-mono text-sm break-all">{item.signer}</p>
                                </div>
                                <div className="mt-3">
                                    <p className="text-xs text-gray-400">Signature:</p>
                                    <p className="font-mono text-sm break-all text-gray-500">{item.signature}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
        </div>
    );
};