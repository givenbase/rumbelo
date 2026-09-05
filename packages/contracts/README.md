# @rumbelo/contracts

Shared oRPC contract, Zod schemas, and TypeScript enums for app + backend.

## Enums

Source of truth: `src/enums/` (ALL_CAPS keys **and** values — no mixed case).

```ts
import { DebtKind } from '@rumbelo/contracts';
import { z } from 'zod';

// ✅ Zod 4
z.enum(DebtKind);

// ❌ deprecated in Zod 4
z.nativeEnum(DebtKind);
```

Backend MikroORM columns use the same enums via `NativeEnum({ DebtKind, domain: 'money' })`
(see `apps/backend/README.md` → Conventions).
