import { type FC, useState } from "react";
import {
    DynamicWidget,
    useDynamicContext,
    useMfa,
    useSyncMfaFlow,
} from "@dynamic-labs/sdk-react-core";

import { WalletActions } from '../components/wallet/WalletActions';
import { QRCodeView } from '../components/auth/QRCodeView';
import { OTPView } from '../components/auth/OTPView';
import { BackupCodesView } from '../components/auth/BackupCodesView';
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

type MfaRegisterData = {
    uri: string;
    secret: string;
};

export const AuthFlow: FC = () => {
    const [mfaRegisterData, setMfaRegisterData] = useState<MfaRegisterData>();
    const [currentView, setCurrentView] = useState<string>("devices");
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [error, setError] = useState<string>();

    const { user, userWithMissingInfo, handleLogOut } = useDynamicContext();
    const { addDevice, authDevice, getUserDevices, getRecoveryCodes, completeAcknowledgement } = useMfa();
    const isMfaRequired = userWithMissingInfo?.scope?.includes("requiresAdditionalAuth");

    useSyncMfaFlow({
        handler: async () => {
            if (userWithMissingInfo?.scope?.includes("requiresAdditionalAuth")) {
                const devices = await getUserDevices();
                setError(undefined);
                if (devices.length === 0) {
                    const { uri, secret } = await addDevice();
                    setMfaRegisterData({ secret, uri });
                    setCurrentView("qr-code");
                } else {
                    setMfaRegisterData(undefined);
                    setCurrentView("otp");
                }
            } else {
                // This flow runs after MFA is complete
                const codes = await getRecoveryCodes();
                setBackupCodes(codes);
                setCurrentView("backup-codes");
            }
        },
    });

    const onAddDevice = async () => {
        setError(undefined);
        const { uri, secret } = await addDevice();
        setMfaRegisterData({ secret, uri });
        setCurrentView("qr-code");
    };

    const onQRCodeContinue = () => {
        setError(undefined);
        setMfaRegisterData(undefined);
        setCurrentView("otp");
    };

    const onOtpSubmit = async (code: string) => {
        try {
            await authDevice(code);
            // The useSyncMfaFlow will handle the next step (showing backup codes)
        } catch (e: any) {
            setError(e.message || 'Invalid OTP code. Please try again.');
        }
    };

    const onBackupCodesAccepted = () => {
        completeAcknowledgement();
        setCurrentView('devices'); // Return to the main view
    };

    const onLogout = () => {
        handleLogOut();
        localStorage.removeItem('signHistory');
    };

    const getMfaView = () => {
        if (currentView === "qr-code" && mfaRegisterData) {
            return (
                <Card title="1. Set up MFA">
                    <QRCodeView data={mfaRegisterData} onContinue={onQRCodeContinue} />
                </Card>
            );
        }
        if (currentView === "otp") {
            return (
                <Card title="2. Verify Device">
                    <OTPView onSubmit={onOtpSubmit} />
                </Card>
            );
        }
        if (currentView === "backup-codes" && backupCodes.length > 0) {
            return (
                <Card title="3. Save Backup Codes">
                    <BackupCodesView codes={backupCodes} onAccept={onBackupCodesAccepted} />
                </Card>
            );
        }
        // Default authenticated view
        return <WalletActions />;
    }

    return (
        <div className="w-full flex flex-col items-center gap-6">
            {/* Header: Stacks vertically on mobile, horizontally on larger screens */}
            <header className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                <h1 className="text-2xl font-bold text-white">Web3 Message Signer & Verifier</h1>
                <div className="flex items-center gap-4">
                    <DynamicWidget />
                    {user && <Button onClick={onLogout} variant="secondary">Log Out</Button>}
                </div>
            </header>

            {error &&
                <div className="w-full max-w-md p-4 text-center bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg">
                    {error}
                </div>
            }

            <main className="w-full flex flex-col items-center">
                {getMfaView()}

                {/* MFA controls: Stacks vertically on mobile, horizontally on larger screens */}
                {currentView === "devices" && isMfaRequired && (
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto max-w-md">
                        <Button variant="secondary" className="w-full sm:w-auto"
                            onClick={onAddDevice}
                        >
                            Add Another Device
                        </Button>
                        <Button variant="secondary" className="w-full sm:w-auto"
                            onClick={async () => {
                                const codes = await getRecoveryCodes(true);
                                setBackupCodes(codes);
                                setCurrentView("backup-codes");
                            }}
                        >
                            Generate New Recovery Codes
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
};