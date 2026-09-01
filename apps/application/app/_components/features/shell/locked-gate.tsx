'use client';

import type { PlanKey } from '@/app/_lib/plan';
import { PLAN_LABELS } from '@/app/_lib/plan';
import { Button } from '@rumbelo/ui';

export function LockedGate({ requiredPlan }: { requiredPlan: PlanKey }) {
  return (
    <div className="flex min-h-[40dvh] flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-line-strong bg-raised/40 px-6 py-12 text-center animate-rise">
      <span className="text-4xl" aria-hidden>
        🔒
      </span>
      <div>
        <p className="font-display text-xl font-semibold text-fg">
          Beschikbaar in het {PLAN_LABELS[requiredPlan]}-plan
        </p>
        <p className="mt-1.5 max-w-xs text-sm text-fg-muted">
          Upgrade naar {PLAN_LABELS[requiredPlan]} om toegang te krijgen tot dit scherm en alles
          wat daarin zit.
        </p>
      </div>
      <Button as="a" href="/settings/plan">
        Plan bekijken
      </Button>
    </div>
  );
}
