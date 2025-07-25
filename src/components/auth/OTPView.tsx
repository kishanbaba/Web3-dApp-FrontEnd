import { type FC } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface OTPViewProps {
    onSubmit: (code: string) => void;
}

export const OTPView: FC<OTPViewProps> = ({ onSubmit }) => (
    <form
        onSubmit={(e) => {
            e.preventDefault();
            const otpValue = (e.currentTarget.elements.namedItem('otp') as HTMLInputElement)?.value;
            if (otpValue) {
                onSubmit(otpValue);
            }
        }}
        className="flex flex-col gap-4"
    >
        <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1">
                Enter a code from your authenticator app
            </label>
            <Input
                type="text"
                name="otp"
                id="otp"
                placeholder="123456"
                required
                pattern="\d{6}"
                title="Please enter a 6-digit code"
            />
        </div>
        <Button type="submit" className="w-full">
            Verify & Continue
        </Button>
    </form>
);