'use client';

import { useEffect, useRef } from 'react';
import { LandingHeader } from './landing-header';
import { LandingHero } from './landing-hero';
import { LandingPillars } from './landing-pillars';
import { LandingJars } from './landing-jars';
import { LandingHowItWorks } from './landing-how-it-works';
import { LandingCoachGlance } from './landing-coach-glance';
import { LandingWhyBand } from './landing-why-band';
import { LandingPricing } from './landing-pricing';
import { LandingSignupForm } from './landing-signup-form';
import { LandingFooter } from './landing-footer';

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
      root.querySelectorAll<HTMLElement>('section[data-reveal=""]').forEach((sec) => {
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
      <LandingHero />
      <LandingPillars />
      <LandingJars />
      <LandingHowItWorks />
      <LandingCoachGlance />
      <LandingWhyBand />
      <LandingPricing />
      <LandingSignupForm />
      <LandingFooter />
    </div>
  );
}
