'use client';

import Link from 'next/link';

import { Button } from '@rumtelo/ui';

export function IntentStillnessLink() {
    return (
        <Button
            as={Link}
            href="/product/soul/stillness"
            variant="ghost"
            size="sm"
            className="justify-self-start">
            Go to stillness →
        </Button>
    );
}
