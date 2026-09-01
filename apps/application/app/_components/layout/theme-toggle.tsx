'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

/**
 * Writes the choice to localStorage and the data-theme attribute. The inline
 * script in layout.tsx replays it before paint so there is no flash.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = localStorage.getItem('rumbelo-theme');
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored);
      return;
    }
    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('rumbelo-theme', next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Schakel naar lichte modus' : 'Schakel naar donkere modus'}
      className="grid size-9 place-items-center rounded-lg border border-line text-fg-secondary transition-colors hover:bg-raised hover:text-fg"
    >
      <span aria-hidden>{theme === 'dark' ? '☾' : '☀'}</span>
    </button>
  );
}
