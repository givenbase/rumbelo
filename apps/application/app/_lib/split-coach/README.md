# Split coach

Soft guidance when someone changes their income jar split. Never blocks save. Defaults stay **T. Harv Eker** (`DEFAULT_JAR_SPLIT` in `@rumbelo/contracts`): **55 / 10 / 10 / 10 / 10 / 5**.

## Why

People often raise Play or Give by cutting Financial Freedom or Long Term Savings. The coach surfaces that trade-off in plain English and points at a better order of operations: **pay yourself first, then fun and giving**.

Override is always allowed — tips are coaching, not rules.

## Phases

### A — Split tips (shipped)

**Where:** Settings → Jars (`JarsSettings`), live while sliders move.

**What:** Rule-based tips from current percentages vs soft floors/ceilings.

**Code:** `evaluate.ts`, `types.ts`. UI dismisses tips per session; Save still works.

### B — Money character (shipped)

Person-scoped `MoneyCharacter` on `account_settings` (`SPENDER` | `SAVER` | `BALANCED` | `UNKNOWN`):

- Self-declare on onboarding (“I tend to…”) and Settings → Account
- Passed into `evaluateSplitCoach` for the **current user**
- Household board also stores `incomeRhythm` (STABLE | VARIABLE) and `payoffStrategy` (AVALANCHE | SNOWBALL) — shared decisions, not personality

Character is descriptive, never judgmental — “leans spender”, never “bad with money”.

### B2 — Infer from behaviour (later)

Optional inferred override with low confidence until enough periods exist (spend rate on Play, FF underfunded, etc.).

### C — Weekly coach card (later)

One card on Home / Jars — one tip, one CTA, at most once per week per tip id.

## Product principles

1. **Default is the teaching** — Eker split is the baseline; tips explain drift.
2. **Soft** — warn / info only; no hard validation on save.
3. **Priority language** — Freedom and Long Term before Play/Give when there’s a conflict.
4. **English, short** — one thought per tip.
5. **Person vs board** — personality on the person; debt order and income rhythm on the household.

## API surface

```ts
evaluateSplitCoach(pctByKey, character?: MoneyCharacter): SplitTip[]
pctByJarKey(jars, pctById): SplitPctByKey
```

`MoneyCharacter` lives in `@rumbelo/contracts`.

## Out of scope (for now)

- Blocking invalid splits beyond “must sum to 100”
- ML / LLM coaching copy
- Cross-household comparisons
- Tax or investment advice beyond jar allocation
