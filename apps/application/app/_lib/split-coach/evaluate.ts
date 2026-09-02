import type { JarKey } from '@rumbelo/contracts';

import {
    DEFAULT_JAR_SPLIT,
    SPLIT_SOFT_CEILING,
    SPLIT_SOFT_FLOOR,
    type MoneyCharacter,
    type SplitPctByKey,
    type SplitTip,
} from './types';

/**
 * Rule-based split coach (Phase A).
 * Pure — no I/O. Later phases pass `character` from inferred or declared style.
 */
export function evaluateSplitCoach(
    pct: SplitPctByKey,
    character: MoneyCharacter = 'unknown'
): SplitTip[] {
    const tips: SplitTip[] = [];
    const play = pct.PLAY ?? DEFAULT_JAR_SPLIT.PLAY;
    const give = pct.GIVE ?? DEFAULT_JAR_SPLIT.GIVE;
    const edu = pct.EDUCATION ?? DEFAULT_JAR_SPLIT.EDUCATION;
    const ff = pct.FINANCIAL_FREEDOM ?? DEFAULT_JAR_SPLIT.FINANCIAL_FREEDOM;
    const lts = pct.LONG_TERM_SAVINGS ?? DEFAULT_JAR_SPLIT.LONG_TERM_SAVINGS;
    const nec = pct.NECESSITIES ?? DEFAULT_JAR_SPLIT.NECESSITIES;

    const futureFirst = ff + lts;
    const futureDefault =
        DEFAULT_JAR_SPLIT.FINANCIAL_FREEDOM + DEFAULT_JAR_SPLIT.LONG_TERM_SAVINGS;

    if (play > SPLIT_SOFT_CEILING.PLAY) {
        tips.push({
            id: 'play-above-default',
            severity: 'warn',
            jars: ['PLAY', 'FINANCIAL_FREEDOM', 'LONG_TERM_SAVINGS'],
            message:
                character === 'saver'
                    ? 'Play above 10% can be healthy if you under-spend joy — just don’t fund it by cutting Financial Freedom.'
                    : 'Play above 10% usually comes from Financial Freedom or Long Term Savings. Those two buy your future; Play spends this month.',
        });
    }

    if (give > SPLIT_SOFT_CEILING.GIVE) {
        tips.push({
            id: 'give-above-default',
            severity: 'info',
            jars: ['GIVE', 'FINANCIAL_FREEDOM'],
            message:
                'Give above 5% is generous — keep Financial Freedom at least at 10% so giving doesn’t replace paying yourself first.',
        });
    }

    if (edu > SPLIT_SOFT_CEILING.EDUCATION) {
        tips.push({
            id: 'edu-above-soft',
            severity: 'info',
            jars: ['EDUCATION', 'FINANCIAL_FREEDOM'],
            message:
                'Education raises earning power — still protect Financial Freedom at 10% so learning doesn’t crowd out investing.',
        });
    }

    if (ff < SPLIT_SOFT_FLOOR.FINANCIAL_FREEDOM) {
        tips.push({
            id: 'ff-below-default',
            severity: 'warn',
            jars: ['FINANCIAL_FREEDOM'],
            message:
                'Financial Freedom under 10% means you’re paying everyone else first. Put yourself back in the split before raising Play or Give.',
        });
    }

    if (lts < SPLIT_SOFT_FLOOR.LONG_TERM_SAVINGS) {
        tips.push({
            id: 'lts-below-default',
            severity: 'warn',
            jars: ['LONG_TERM_SAVINGS'],
            message:
                'Long Term Savings under 10% leaves no buffer for planned big things. Raise this before expanding Play.',
        });
    }

    if (futureFirst < futureDefault && (play > DEFAULT_JAR_SPLIT.PLAY || give > DEFAULT_JAR_SPLIT.GIVE)) {
        tips.push({
            id: 'future-vs-fun',
            severity: 'warn',
            jars: ['PLAY', 'GIVE', 'FINANCIAL_FREEDOM', 'LONG_TERM_SAVINGS'],
            message:
                'You’re funding today (Play / Give) while shrinking tomorrow (Freedom + Long Term). Prefer raising those two before fun.',
        });
    }

    if (nec > SPLIT_SOFT_CEILING.NECESSITIES) {
        tips.push({
            id: 'nec-high',
            severity: 'info',
            jars: ['NECESSITIES'],
            message:
                'Necessity above 60% squeezes every other jar. Cutting fixed costs usually helps more than cutting Freedom.',
        });
    }

    if (nec < SPLIT_SOFT_FLOOR.NECESSITIES) {
        tips.push({
            id: 'nec-low',
            severity: 'warn',
            jars: ['NECESSITIES'],
            message:
                'Necessity under 45% is tight for most households — check rent, insurance and debt instalments still fit.',
        });
    }

    // Character-specific nudges (Phase B — works once character ≠ unknown)
    if (character === 'spender' && play >= DEFAULT_JAR_SPLIT.PLAY && ff <= DEFAULT_JAR_SPLIT.FINANCIAL_FREEDOM) {
        tips.push({
            id: 'spender-ff',
            severity: 'info',
            jars: ['PLAY', 'FINANCIAL_FREEDOM'],
            message:
                'Your pattern leans spender — try +1–2% into Financial Freedom before adding more Play.',
        });
    }

    if (character === 'saver' && play < 5 && ff + lts >= 25) {
        tips.push({
            id: 'saver-play',
            severity: 'info',
            jars: ['PLAY'],
            message:
                'Your pattern leans saver — a little more Play can make the plan sustainable. Joy that is planned is not waste.',
        });
    }

    return dedupeTips(tips);
}

function dedupeTips(tips: SplitTip[]): SplitTip[] {
    const seen = new Set<string>();
    return tips.filter(t => {
        if (seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
    });
}

/** Map jar list rows → % by key for the evaluator. */
export function pctByJarKey(
    jars: ReadonlyArray<{ key: string; id: string; percentage: number }>,
    pctById: Record<string, number>
): SplitPctByKey {
    const out: SplitPctByKey = {};
    for (const jar of jars) {
        const key = jar.key as JarKey;
        out[key] = pctById[jar.id] ?? jar.percentage;
    }
    return out;
}
