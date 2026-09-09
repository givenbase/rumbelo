'use client';

import { useEffect, useRef } from 'react';

import { LandingCoach } from './landing-coach';
import { LandingFaq } from './landing-faq';
import { LandingFooter } from './landing-footer';
import { LandingHeader } from './landing-header';
import { LandingHero } from './landing-hero';
import { LandingJars } from './landing-jars';
import { LandingLoop } from './landing-loop';
import { LandingPortals } from './landing-portals';
import { LandingPricing } from './landing-pricing';
import { LandingPrinciples } from './landing-principles';
import { LandingProblem } from './landing-problem';
import { LandingSignupForm } from './landing-signup-form';
import { LandingWhy } from './landing-why';

/**
 * Narrative order (docs/brand/quotes.md → "How to use"):
 *   hook (money punch) → name the problem → widen to four portals → the loop →
 *   the Coach (aspirant ↔ mentor) → principles → jars → why we exist → pricing → FAQ → sign-up.
 */
export function LandingPage() {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const sections = Array.from(root.querySelectorAll<HTMLElement>('section'));
        sections.forEach((sec, i) => {
            if (i === 0) return;
            if (sec.getBoundingClientRect().top < window.innerHeight) return;
            sec.setAttribute('data-reveal', '');
        });

        let pending = false;
        const check = () => {
            pending = false;
            root.querySelectorAll<HTMLElement>('section[data-reveal=""]').forEach(sec => {
                if (sec.getBoundingClientRect().top < window.innerHeight * 0.88) {
                    sec.setAttribute('data-reveal', 'in');
                }
            });
        };
        const onScroll = () => {
            if (pending) return;
            pending = true;
            requestAnimationFrame(check);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        check();
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    return (
        <div ref={rootRef} className="min-h-screen">
            <LandingHeader />
            <main>
                <LandingHero />
                <LandingProblem />
                <LandingPortals />
                <LandingLoop />
                <LandingCoach />
                <LandingPrinciples />
                <LandingJars />
                <LandingWhy />
                <LandingPricing />
                <LandingFaq />
                <LandingSignupForm />
            </main>
            <LandingFooter />
        </div>
    );
}
