import { type FC, type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
}

export const Button: FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
    const baseStyle = "font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
        primary: "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
        secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    };

    return (
        <button className={`${baseStyle} ${variantStyles[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};