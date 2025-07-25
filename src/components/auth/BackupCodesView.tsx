import { type FC, useState } from 'react';
import { Button } from '../ui/Button';

interface BackupCodesViewProps {
    codes: string[];
    onAccept: () => void;
}

export const BackupCodesView: FC<BackupCodesViewProps> = ({ codes, onAccept }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(codes.join('\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-gray-300">
                Save these backup codes in a secure place. They can be used to recover your account if you lose access to your device.
            </p>
            {/* Grid: 1 column on mobile, 2 columns on screens 'sm' and up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 bg-gray-900 p-4 rounded-lg font-mono text-lg">
                {codes.map((code) => (
                    <p key={code}>{code}</p>
                ))}
            </div>
            <Button onClick={handleCopy} variant="secondary" className="w-full">
                {copied ? 'Copied!' : 'Copy Codes'}
            </Button>
            <Button onClick={onAccept} className="w-full">
                I have saved my codes
            </Button>
        </div>
    );
};