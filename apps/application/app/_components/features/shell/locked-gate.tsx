'use client';

import type { PlanKey } from '@/app/_lib/plan';
import { PLAN_LABELS } from '@/app/_lib/plan';
import { Button } from '@rumbelo/ui';

export function LockedGate({ requiredPlan }: { requiredPlan: PlanKey }) {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-line-strong bg-raised/40 px-6 py-12 text-center animate-rise">
      <span className="text-4xl" aria-hidden>
        🔒
      </span>
      <div>
        <p className="font-display text-xl font-semibold text-fg">
          Available in the {PLAN_LABELS[requiredPlan]} plan
        </p>
        <p className="mt-1.5 max-w-xs text-sm text-fg-muted">
          Upgrade to {PLAN_LABELS[requiredPlan]} to unlock this screen and everything inside it.
        </p>
      </div>
      <Button as="a" href="/settings/plan">
        View plan
      </Button>
    </div>
  );
}
