/** Browser download helpers for settings export (client-side from live API data). */

export function downloadTextFile(filename: string, content: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
}

function csvEscape(value: unknown): string {
    const raw =
        value === null || value === undefined
            ? ''
            : typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean' ||
                typeof value === 'bigint'
              ? String(value)
              : JSON.stringify(value);
    if (/[",\n\r]/.test(raw)) return `"${raw.replace(/"/g, '""')}"`;
    return raw;
}

export function toCsv(rows: Record<string, unknown>[]): string {
    if (rows.length === 0) return '';
    const headers = Object.keys(rows[0]!);
    const lines = [
        headers.join(','),
        ...rows.map(row => headers.map(header => csvEscape(row[header])).join(',')),
    ];
    return lines.join('\n');
}
