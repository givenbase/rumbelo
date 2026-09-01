import { cva } from 'class-variance-authority';

const buttonVariants = cva(
    [
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap',
        'transition-all duration-200 ease-out hover:brightness-110 active:scale-95',
        'disabled:pointer-events-none disabled:opacity-45',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    ].join(' '),
    {
        defaultVariants: {
            size: 'md',
            variant: 'primary',
        },
        variants: {
            size: {
                sm: 'h-9 px-4 text-xs',
                md: 'h-10 px-4 text-sm',
                lg: 'h-12 px-6 text-base',
            },
            variant: {
                primary: 'bg-accent text-on-accent shadow-glow',
                secondary: 'border border-line-strong bg-transparent text-fg',
                ghost: 'text-fg-secondary hover:bg-raised hover:text-fg',
            },
        },
    }
);

export default buttonVariants;
