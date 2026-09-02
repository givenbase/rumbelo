# Settings

Settings follows the **product tree**, not a flat preference dump.

## Structure

1. **Platform** (General / Data) — Account, Plan, Export. Cross-product identity and billing.
2. **Per product** — Money / Growth / Energy / Soul, same groups as `NAV_GROUPS` in [`nav.ts`](../../_lib/nav.ts).
3. **Only children that need prefs** get a settings entry. Overview hubs do not.

## Money (example)

| Product child | Settings route | Owns |
| --- | --- | --- |
| Jars | `/settings/jars` | Split %, jar→account, split coach |
| Debt | `/settings/debt` | Avalanche / snowball |
| Accounts (infra) | `/settings/bank` | Manual accounts + PSD2 |
| Rules (infra) | `/settings/systeem` | Automation toggles |

Spending / Fixed have no settings page yet — add one only when that child needs lasting prefs.

## Source of truth

Nav labels and sections: [`settings-tabs.ts`](../../_lib/settings-tabs.ts) (`SETTINGS_SECTIONS`, `product` + `productChild`).

Chrome: [`settings-shell.tsx`](../../_components/layout/settings-shell.tsx) — desktop: compact label-only rail (`w-40`); mobile: horizontal chips. Subs live in `title` tooltips.

Panels: [`settings-panels.tsx`](../_components/settings-panels.tsx).
