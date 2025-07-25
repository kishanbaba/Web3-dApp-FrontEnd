import { type FC } from 'react';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { Card } from '../components/ui/Card';

export const LogInView: FC = () => {
    return (
        // Use flex to vertically and horizontally center the login card in the viewport
        <div className="flex-grow flex flex-col items-center justify-center w-full">
            <Card title="Welcome">
                <div className="flex flex-col items-center gap-4 p-4">
                    <p className="text-gray-300">Please connect your wallet to continue.</p>
                    <DynamicWidget />
                </div>
            </Card>
        </div>
    );
};