'use client';

import Link from 'next/link';
import { Button } from '@rumbelo/ui';

export function IntentStillnessLink() {
  return (
    <Button as={Link} href="/soul/mind" variant="ghost" size="sm" className="justify-self-start">
      Go to stillness →
    </Button>
  );
}
