import { cva } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold',
  {
    defaultVariants: { tone: 'neutral' },
    variants: {
      tone: {
        neutral: 'bg-raised text-fg-secondary',
        success: 'bg-success/10 text-success',
        warning: 'bg-warning/10 text-warning',
        danger: 'bg-danger/10 text-danger',
      },
    },
  },
);

export default badgeVariants;
