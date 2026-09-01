'use client';

import { cn } from '@rumbelo/utils';

import type ButtonProps from './types';

import buttonVariants from './styles';

/** Brand Button — rounded-full accent treatment from the Rumbelo design system. */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  as: Tag = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <Tag className={cn(buttonVariants({ size, variant }), className)} {...props}>
      {iconLeft}
      {children}
      {iconRight}
    </Tag>
  );
}

export { buttonVariants };
export type { ButtonProps, ButtonSize, ButtonVariant } from './types';
