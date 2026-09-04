/** Minimal HTML shell — keep templates calm and on-brand, no card clutter. */
export function renderEmailLayout(opts: {
    title: string;
    preheader?: string;
    bodyHtml: string;
}): string {
    const preheader = opts.preheader
        ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${opts.preheader}</div>`
        : '';

    return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ec;font-family:Georgia,'Times New Roman',serif;color:#1c1917;">
  ${preheader}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ec;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:#fffaf4;border:1px solid #e7e0d6;">
          <tr>
            <td style="padding:28px 28px 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#78716c;">
              Rumbelo
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;font-size:16px;line-height:1.55;">
              ${opts.bodyHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function escapeHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}
