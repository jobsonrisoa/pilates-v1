import * as React from 'react';

import { cn } from '@/lib/utils';

export type ButtonVariant = 'default' | 'destructive' | 'outline';
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = 'button', variant = 'default', ...props }, ref) => {
    const variantClass =
      variant === 'destructive'
        ? 'bg-red-600 text-white hover:bg-red-700'
        : variant === 'outline'
          ? 'border border-gray-300 bg-transparent text-black hover:bg-gray-100'
          : 'bg-black text-white hover:opacity-90';

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium',
          variantClass,
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
