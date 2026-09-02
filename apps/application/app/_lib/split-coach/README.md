# Split coach

Soft guidance when someone changes their income jar split. Never blocks save. Defaults stay **T. Harv Eker** (`DEFAULT_JAR_SPLIT` in `@rumbelo/contracts`): **55 / 10 / 10 / 10 / 10 / 5**.

## Why

People often raise Play or Give by cutting Financial Freedom or Long Term Savings. The coach surfaces that trade-off in plain English and points at a better order of operations: **pay yourself first, then fun and giving**.

Override is always allowed — tips are coaching, not rules.

## Phases

### A — Split tips (shipped)

**Where:** Settings → Jars (`JarsSettings`), live while sliders move.

**What:** Rule-based tips from current percentages vs soft floors/ceilings:

| Signal | Soft threshold | Intent |
| --- | --- | --- |
| Play high | > 10% | Prefer not funding from FF / LTS |
| Give high | > 5% | Keep FF ≥ 10% |
| Education high | > 12% | Don’t crowd out FF |
| FF low | < 10% | Pay yourself first |
| LTS low | < 10% | Protect planned big costs |
| Future vs fun | FF+LTS below default while Play/Give above | Explicit trade-off |
| Necessities | > 60% or < 45% | Squeeze / under-budget risk |

**Code:** `evaluate.ts`, `types.ts`. UI dismisses tips per session; Save still works.

### B — Money character (next)

Infer a soft **spender / saver / balanced** label from behaviour (not a quiz alone):

- Spend rate on Play vs allocation
- How often FF is raided or underfunded
- Debt payoff vs surplus investing
- Optional self-declare on onboarding (“I tend to…”)

Pass `character` into `evaluateSplitCoach` so tips personalise (hooks already exist for `spender` / `saver`).

Store as household preference + optional inferred override with low confidence until enough periods exist.

### C — Weekly coach card (later)

One card on Home / Jars:

- One tip, one CTA (“Raise Freedom 1%”, “Open Play”)
- Based on last period behaviour + current split
- Never nag more than once per week per tip id

## Product principles

1. **Default is the teaching** — Eker split is the baseline; tips explain drift.
2. **Soft** — warn / info only; no hard validation on save.
3. **Priority language** — Freedom and Long Term before Play/Give when there’s a conflict.
4. **English, short** — one thought per tip.
5. **Character is descriptive, not judgmental** — “leans spender”, never “bad with money”.

## API surface

```ts
evaluateSplitCoach(pctByKey, character?: MoneyCharacter): SplitTip[]
pctByJarKey(jars, pctById): SplitPctByKey
```

Wire character from prefs once Phase B lands; until then pass `'unknown'`.

## Out of scope (for now)

- Blocking invalid splits beyond “must sum to 100”
- ML / LLM coaching copy
- Cross-household comparisons
- Tax or investment advice beyond jar allocation
