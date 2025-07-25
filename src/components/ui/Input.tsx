import { type FC, type InputHTMLAttributes } from 'react';

export const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
    const style = "block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
    return <input className={`${style} ${className}`} {...props} />;
};