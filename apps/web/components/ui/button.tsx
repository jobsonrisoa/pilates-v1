import * as React from 'react';

import { cn } from '@/lib/utils';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium',
          'bg-black text-white hover:opacity-90',
          'disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';


