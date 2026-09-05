# `@rumbelo/eslint-config`

Shared ESLint flat configs for Rumbelo apps and packages.

## Naming — `id-length`

Single-letter locals are an **error** (`min: 2`). Only `_` is excepted (unused).

```ts
// ❌
rows.map(g => g.target)
debts.reduce((s, d) => s + d.balance, 0)

// ✅
rows.map(goal => goal.target)
debts.reduce((total, debt) => total + debt.balance, 0)
```

Object **property** names are not checked (`properties: "never"`). Two-letter names like `em` / `id` are fine.

Prefer domain words over jargon shorthand even when length ≥ 2: `transaction` not `tx`, `allocation` not `alloc`.

## Also enforced

- Unused imports / vars (`unused-imports`)
- Import sort (`perfectionist`)
- Prefer `type` imports
