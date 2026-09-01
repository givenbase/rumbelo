'use client';

import * as React from 'react';
import { cn } from '@rumbelo/utils';
import { controlClasses } from '../Input';

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(controlClasses, 'h-auto resize-none py-3', className)}
      {...props}
    />
  );
}
