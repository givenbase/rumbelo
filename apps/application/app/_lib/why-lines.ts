/**
 * The one-line "why this screen" caption shown above every screen's content.
 * English strings from the design (Kluis Finance App.dc.html:3130-3148, EN column),
 * rekeyed by route pathname.
 */
export const WHY_LINES: Record<string, string> = {
  '/':
    'One look, one question: do I have the reins this month?',
  '/money/jars':
    'This month, divided before it starts. Money with a job never has to be defended.',
  '/money/transactions':
    'You do not track spending to judge yourself — you track it to see where your life leaks.',
  '/money/debts':
    'Debt is rented time. Every euro of interest is an hour of your life someone else directs.',
  '/money/fixed-costs':
    'Fixed costs are decisions you made once and pay for monthly. Review them like decisions.',
  '/growth/goals':
    "A goal turns this month's surplus into something that lasts. With a date and a jar it is a plan.",
  '/growth/board':
    'Money is this month. Net worth is the years. You are wealthy the day it pays for your life.',
  '/energy/week':
    'Your hours are your capacity. Divided on purpose, or by whoever asks loudest.',
  '/energy/sleep':
    'Sleep is the floor the jars stand on. Cut it and every other number quietly drops.',
  '/soul/mind':
    'A calm mind directs money. A restless one spends it and calls that a decision.',
  '/soul/gratitude':
    'Someone who sees what he already has buys less to fill a hole.',
  '/soul/intent':
    'An intention is an instruction to yourself. A resolution is a hope.',
  '/soul/chakra':
    'Name where it feels stuck, and the next step usually names itself.',
  '/growth/income':
    'Cutting costs has a floor. Raising income does not.',
  '/growth/learn':
    'A book you cannot name a use for was Play spending, not Education.',
  '/energy/train':
    'Training is the only spend that raises the value of every other hour.',
  '/energy/food':
    'Food is fuel for the week your jars divide. Fuel is bought, not willed.',
  '/ritual':
    'Ten minutes with your coach beats worrying every day. This is the whole practice.',
  '/why':
    'One line on your dashboard — not a poster, a check question when a jar gets tight.',
};

/** Screens with no caption (portal hubs use their own `line`). */
export function whyLineFor(pathname: string): string | null {
  return WHY_LINES[pathname] ?? null;
}
