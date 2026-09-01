'use client';

import { useState } from 'react';

type Theme = 'light' | 'dark';

function readTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem('rumbelo-theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // localStorage unavailable — fall through to DOM check
  }
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export function LandingThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('rumbelo-theme', next);
    } catch {
      // localStorage unavailable — theme change applied to DOM only
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
      className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border border-line bg-transparent text-sm text-fg-muted transition-colors hover:border-accent hover:text-accent"
      suppressHydrationWarning
    >
      {theme === 'dark' ? '☽' : '☀'}
    </button>
  );
}
