# @rumtelo/brand

Single source of truth for Rumtelo logos and lockups.

## Why here (not `apps/*/public`)

Website and application both need the same files. Putting them in one package
and **symlinking** each app’s `public/brand` → `packages/brand/assets` means:

- no duplicated binaries
- same `/brand/...` URLs in both Next apps
- one place to drop a real designer SVG later

## Layout

```
packages/brand/assets/
  rumtelo-mark.png              # icon only
  rumtelo-mark.svg              # points at the PNG until we have vectors
  rumtelo-wordmark.png          # horizontal lockup (light)
  rumtelo-wordmark.svg
  rumtelo-wordmark-on-dark.jpg  # horizontal lockup on dark
  rumtelo-lockup.jpg            # square presentation asset
```

## Usage

```tsx
import { RumteloLogo, BRAND_ASSETS } from '@rumtelo/brand';

<RumteloLogo variant="wordmark" className="h-7 w-auto" />
<img src={BRAND_ASSETS.mark} alt="" />
```

## Symlinks

From the repo root (already created for website + application):

```bash
ln -sfn ../../../packages/brand/assets apps/website/public/brand
ln -sfn ../../../packages/brand/assets apps/application/public/brand
```
