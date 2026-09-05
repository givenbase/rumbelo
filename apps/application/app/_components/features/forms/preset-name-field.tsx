'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Input } from '@rumbelo/ui';

export type NamePresetOption = {
    key: string;
    name: string;
    group?: string;
};

type PresetNameFieldProps = {
    value: string;
    onChange: (name: string) => void;
    onSelect?: (preset: NamePresetOption) => void;
    options: NamePresetOption[];
    placeholder?: string;
    disabled?: boolean;
    id?: string;
};

/**
 * Name input with a suggestion dropdown (design: New debt modal).
 * Free typing always allowed; selecting a preset calls onSelect then fills name.
 */
export function PresetNameField({
    value,
    onChange,
    onSelect,
    options,
    placeholder = 'e.g. rent',
    disabled,
    id,
}: PresetNameFieldProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    const selectedKey = useMemo(() => {
        const match = options.find(o => o.name.toLowerCase() === value.trim().toLowerCase());
        return match?.key ?? null;
    }, [options, value]);

    const grouped = useMemo(() => {
        const map = new Map<string, NamePresetOption[]>();
        for (const opt of options) {
            const g = opt.group ?? '';
            const list = map.get(g) ?? [];
            list.push(opt);
            map.set(g, list);
        }
        return [...map.entries()];
    }, [options]);

    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    return (
        <div ref={rootRef} className="relative">
            <div className="relative">
                <Input
                    id={id}
                    value={value}
                    disabled={disabled}
                    placeholder={placeholder}
                    autoComplete="off"
                    onChange={e => onChange(e.target.value)}
                    onFocus={() => setOpen(true)}
                />
                <button
                    type="button"
                    disabled={disabled || options.length === 0}
                    aria-label="Show suggestions"
                    className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-accent/15 text-accent hover:bg-accent/25 disabled:opacity-40"
                    onClick={() => setOpen(o => !o)}>
                    <span className="text-xs tracking-widest" aria-hidden>
                        ···
                    </span>
                </button>
            </div>
            {open && options.length > 0 ? (
                <ul
                    role="listbox"
                    className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl bg-fg py-1.5 text-sm text-bg shadow-lg">
                    {grouped.map(([group, items]) => (
                        <li key={group || 'all'}>
                            {group ? (
                                <div className="px-3 pt-2 pb-1 text-[10px] font-semibold tracking-wider text-bg/50 uppercase">
                                    {group}
                                </div>
                            ) : null}
                            <ul>
                                {items.map(opt => {
                                    const selected = opt.key === selectedKey;
                                    return (
                                        <li key={opt.key}>
                                            <button
                                                type="button"
                                                role="option"
                                                aria-selected={selected}
                                                className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-bg/10"
                                                onClick={() => {
                                                    onChange(opt.name);
                                                    onSelect?.(opt);
                                                    setOpen(false);
                                                }}>
                                                <span
                                                    className={`w-4 shrink-0 text-center ${selected ? 'opacity-100' : 'opacity-0'}`}
                                                    aria-hidden>
                                                    ✓
                                                </span>
                                                <span>{opt.name}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}
