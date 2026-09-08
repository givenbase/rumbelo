# @rumbelo/brand

Single source of truth for Rumbelo logos and lockups.

## Why here (not `apps/*/public`)

Website and application both need the same files. Putting them in one package
and **symlinking** each app’s `public/brand` → `packages/brand/assets` means:

- no duplicated binaries
- same `/brand/...` URLs in both Next apps
- one place to drop a real designer SVG later

## Layout

```
packages/brand/assets/
  rumbelo-mark.png              # icon only
  rumbelo-mark.svg              # points at the PNG until we have vectors
  rumbelo-wordmark.png          # horizontal lockup (light)
  rumbelo-wordmark.svg
  rumbelo-wordmark-on-dark.jpg  # horizontal lockup on dark
  rumbelo-lockup.jpg            # square presentation asset
```

## Usage

```tsx
import { RumbeloLogo, BRAND_ASSETS } from '@rumbelo/brand';

<RumbeloLogo variant="wordmark" className="h-7 w-auto" />
<img src={BRAND_ASSETS.mark} alt="" />
```

## Symlinks

From the repo root (already created for website + application):

```bash
ln -sfn ../../../packages/brand/assets apps/website/public/brand
ln -sfn ../../../packages/brand/assets apps/application/public/brand
```
