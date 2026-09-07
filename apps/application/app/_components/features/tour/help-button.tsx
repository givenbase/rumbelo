'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import {
    Button,
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@rumbelo/ui';

import { chrome, pageHelpForPathname } from './content';
import { usePageTour } from './provider';

/** Shell Help — coach copy for the current route, optional Joyride tour. */
export function PageHelpButton() {
    const pathname = usePathname() ?? '/';
    const help = pageHelpForPathname(pathname);
    const { startTour, isTourDone } = usePageTour();
    const [open, setOpen] = useState(false);
    const hasTour = Boolean(help.tourId && (help.tourSteps?.length ?? 0) > 0);
    const replay = help.tourId ? isTourDone(help.tourId) : false;

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                data-tour="shell-help"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-xs font-medium tracking-wide text-fg-faint uppercase transition-colors hover:border-accent-hover hover:text-accent sm:px-3.5">
                <span aria-hidden>?</span>
                <span className="hidden sm:inline">{chrome.help_trigger}</span>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="flex flex-col gap-0 border-line bg-chrome text-fg sm:max-w-md">
                <SheetHeader className="border-b border-line px-1 pb-4 text-left">
                    <SheetTitle className="font-display text-xl font-semibold tracking-tight text-fg">
                        {help.title}
                    </SheetTitle>
                    <SheetDescription className="font-mono text-xs tracking-wide text-fg-muted uppercase">
                        {chrome.sheet_description}
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-4 grid flex-1 gap-5 overflow-y-auto px-1 pb-4">
                    {help.sections.map(section => (
                        <section key={section.heading} className="grid gap-1.5">
                            <h3 className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                                {section.heading}
                            </h3>
                            <p className="text-sm leading-relaxed text-pretty text-fg-secondary">
                                {section.body}
                            </p>
                        </section>
                    ))}
                </div>
                {hasTour && help.tourId ? (
                    <div className="grid gap-2 border-t border-line px-1 pt-4 pb-2">
                        <p className="text-sm text-fg-muted">
                            {replay ? chrome.replay_tour_prompt : chrome.take_tour_prompt}
                        </p>
                        <Button
                            type="button"
                            className="w-full"
                            onClick={() => {
                                const steps = help.tourSteps ?? [];
                                const tourId = help.tourId!;
                                setOpen(false);
                                startTour(tourId, steps);
                            }}>
                            {replay ? chrome.replay_tour : chrome.take_tour}
                        </Button>
                    </div>
                ) : null}
            </SheetContent>
        </Sheet>
    );
}
