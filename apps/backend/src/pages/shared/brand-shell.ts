/**
 * Shared HTML shell for API-host pages — matches product tokens
 * (Bricolage / Public Sans, teal accent, calm light surface).
 */

export type BrandPageOptions = {
    title: string;
    /** Short eyebrow above the headline (e.g. Restricted) */
    eyebrow?: string;
    headline: string;
    message: string;
    /** Optional status line under the message */
    code?: string;
    primaryHref?: string;
    primaryLabel?: string;
    secondaryHref?: string;
    secondaryLabel?: string;
    footerHtml?: string;
    /** Raw HTML injected after actions (e.g. link list). Caller must escape. */
    bodyExtraHtml?: string;
    lang?: 'nl' | 'en';
};

const CSS = `
:root {
  --bg: #edeff3;
  --bg-app: #f5f7f9;
  --surface: #ffffff;
  --fg: #0e1116;
  --fg-muted: #5a6474;
  --fg-secondary: #3e4859;
  --accent: #0f766e;
  --accent-hover: #0d9488;
  --accent-press: #115e59;
  --accent-soft: rgb(15 118 110 / 0.1);
  --line: rgb(14 17 22 / 0.1);
  --radius: 16px;
  --shadow: 0 2px 4px rgb(14 17 22 / 0.06), 0 14px 34px rgb(14 17 22 / 0.1);
  --font-display: "Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Public Sans", ui-sans-serif, system-ui, sans-serif;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { min-height: 100%; }
body {
  font-family: var(--font-sans);
  color: var(--fg);
  background: var(--bg-app);
  -webkit-font-smoothing: antialiased;
}
.stage {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem;
  overflow: hidden;
}
.stage::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(90% 46% at 50% 0%, rgb(13 148 136 / 0.14), transparent 70%),
    radial-gradient(50% 40% at 100% 100%, rgb(3 105 161 / 0.06), transparent 55%),
    linear-gradient(180deg, var(--bg) 0%, var(--bg-app) 100%);
  pointer-events: none;
}
.panel {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 26rem;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 2rem 1.75rem 1.5rem;
  text-align: center;
  animation: rise 420ms var(--ease) both;
}
@keyframes rise {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .panel { animation: none; }
}
.brand {
  margin-bottom: 1.35rem;
}
.brand-mark {
  font-family: var(--font-display);
  font-size: 1.65rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--fg);
  line-height: 1.1;
}
.brand-tag {
  margin-top: 0.35rem;
  font-size: 0.8rem;
  color: var(--fg-muted);
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.85rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent-press);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 999px;
  background: #c81e1e;
  box-shadow: 0 0 0 3px rgb(200 30 30 / 0.15);
}
h1 {
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 3.5vw, 1.6rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
  margin-bottom: 0.65rem;
  color: var(--fg);
}
.message {
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--fg-secondary);
  margin-bottom: 1rem;
}
.code {
  display: inline-block;
  margin-bottom: 1.35rem;
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  border: 1px solid var(--line);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.7rem;
  color: var(--fg-muted);
  letter-spacing: 0.04em;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  align-items: stretch;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.65rem 1.1rem;
  border-radius: 12px;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.15s var(--ease), border-color 0.15s var(--ease), color 0.15s var(--ease);
}
.btn-primary {
  background: linear-gradient(180deg, var(--accent-hover) 0%, var(--accent) 58%, var(--accent-press) 100%);
  color: #fff;
  border: 1px solid transparent;
  box-shadow: 0 8px 26px rgb(15 118 110 / 0.18);
}
.btn-primary:hover { filter: brightness(1.04); }
.btn-ghost {
  background: transparent;
  color: var(--fg-secondary);
  border: 1px solid var(--line);
}
.btn-ghost:hover {
  color: var(--fg);
  border-color: rgb(14 17 22 / 0.2);
  background: var(--bg);
}
.footer {
  margin-top: 1.35rem;
  padding-top: 1rem;
  border-top: 1px solid var(--line);
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--fg-muted);
}
.footer a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}
.footer a:hover { color: var(--accent-hover); text-decoration: underline; }
.links {
  margin-top: 1.25rem;
  text-align: left;
  border-top: 1px solid var(--line);
  padding-top: 1rem;
}
.links a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 0.15rem;
  color: var(--fg);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  border-bottom: 1px solid var(--line);
}
.links a:last-child { border-bottom: none; }
.links a span { color: var(--fg-muted); font-size: 0.8rem; font-weight: 400; }
.links a:hover { color: var(--accent); }
`.trim();

function escapeHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}

export function renderBrandPage(opts: BrandPageOptions): string {
    const lang = opts.lang ?? 'nl';
    const eyebrow = opts.eyebrow
        ? `<div class="eyebrow"><span class="dot" aria-hidden="true"></span>${escapeHtml(opts.eyebrow)}</div>`
        : '';
    const code = opts.code ? `<div class="code">${escapeHtml(opts.code)}</div>` : '';

    const actions: string[] = [];
    if (opts.primaryHref && opts.primaryLabel) {
        actions.push(
            `<a class="btn btn-primary" href="${escapeHtml(opts.primaryHref)}">${escapeHtml(opts.primaryLabel)}</a>`
        );
    }
    if (opts.secondaryHref && opts.secondaryLabel) {
        actions.push(
            `<a class="btn btn-ghost" href="${escapeHtml(opts.secondaryHref)}">${escapeHtml(opts.secondaryLabel)}</a>`
        );
    }

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(opts.title)} · Rumbelo</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;700&family=Public+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>${CSS}</style>
</head>
<body>
  <div class="stage">
    <div class="panel">
      <div class="brand">
        <div class="brand-mark">Rumbelo</div>
        <div class="brand-tag">${lang === 'nl' ? 'Stop met gissen waar het bleef.' : 'Stop wondering where it went.'}</div>
      </div>
      ${eyebrow}
      <h1>${escapeHtml(opts.headline)}</h1>
      <p class="message">${escapeHtml(opts.message)}</p>
      ${code}
      ${actions.length ? `<div class="actions">${actions.join('')}</div>` : ''}
      ${opts.bodyExtraHtml ?? ''}
      ${opts.footerHtml ? `<div class="footer">${opts.footerHtml}</div>` : ''}
    </div>
  </div>
</body>
</html>`;
}

export { escapeHtml };
