import { type FC, useEffect, useRef } from 'react';
import QRCodeUtil from "qrcode";
import { Button } from '../ui/Button';

type MfaRegisterData = {
    uri: string;
    secret: string;
};

interface QRCodeViewProps {
    data: MfaRegisterData;
    onContinue: () => void;
}

export const QRCodeView: FC<QRCodeViewProps> = ({ data, onContinue }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            QRCodeUtil.toCanvas(canvasRef.current, data.uri, { width: 300 }, (error) => {
                if (error) console.error("QRCode generation error:", error);
            });
        }
    }, [data.uri]);

    return (
        <div className="flex flex-col items-center gap-6">
            <p className="text-gray-300 text-center">Scan this QR code with your authenticator app.</p>
            <div className="bg-white p-2 rounded-lg w-60 h-60 sm:w-72 sm:h-72">
                <canvas ref={canvasRef} className="w-full h-full"></canvas>
            </div>
            <div className="text-center">
                <p className="text-gray-400">Can't scan? Use this secret key:</p>
                <p className="font-mono bg-gray-900 px-3 py-1 rounded-md text-indigo-400 mt-1 break-all">{data.secret}</p>
            </div>
            <Button onClick={onContinue} className="w-full">
                Continue
            </Button>
        </div>
    );
};