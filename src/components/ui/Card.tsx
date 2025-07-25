import { type FC, type ReactNode } from 'react';

interface CardProps {
    title?: string;
    children: ReactNode;
    className?: string;
}

export const Card: FC<CardProps> = ({ title, children, className }) => {
    return (
        <div className={`bg-gray-800 shadow-xl rounded-lg w-full max-w-md ${className}`}>
            {title && (
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                </div>
            )}
            <div className="p-4 md:p-4">
                {children}
            </div>
        </div>
    );
};