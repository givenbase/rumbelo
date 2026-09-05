# Settings

```
/settings                         Account
/settings/general/plan            Plan
/settings/data/export             Export
/settings/product/money/…         jars | debt | bank | automation
/settings/product/growth/goals
/settings/product/energy/week
/settings/product/soul/stillness
```

Product prefs nest under the visible **`product`** slug (same domains as the app).
General / data stay outside product.

## Source of truth

`app/_lib/settings-tabs.ts` — `SETTINGS_HREF`, `SETTINGS_SECTIONS`.
