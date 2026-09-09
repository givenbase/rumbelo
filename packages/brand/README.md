# @rumtelo/brand

Single source of truth for Rumtelo logos.

## Why here (not `apps/*/public`)

Website and application both need the same files. Putting them in one package
and **symlinking** each app’s `public/brand` → `packages/brand/assets` means:

- no duplicated binaries
- same `/brand/...` URLs in both Next apps

## Assets

Drop designer files here as-is. Do not crop, re-encode, or invent variants.

```
packages/brand/assets/
  rumtelo-logo-wordmark-on-light.svg    # app — light surfaces
  rumtelo-logo-wordmark-on-dark.svg     # app — dark surfaces
  rumtelo-logo-wordmark-on-light.png    # email — light surfaces
  rumtelo-logo-wordmark-on-dark.png     # email — dark surfaces
```

**App:** SVG. **Email:** PNG (clients don’t reliably render SVG).

## Usage

```tsx
import { RumteloLogo, BRAND_ASSETS } from '@rumtelo/brand';

<RumteloLogo variant="wordmark" className="h-7 w-auto" />
<RumteloLogo variant="wordmarkOnDark" className="h-7 w-auto" />
```

## Symlinks

```bash
ln -sfn ../../../packages/brand/assets apps/website/public/brand
ln -sfn ../../../packages/brand/assets apps/application/public/brand
```
