export type HoldingKind = 'portfolio' | 'property' | 'business' | 'cash' | 'pension';

export const HOLDING_KINDS: ReadonlyArray<{
    key: HoldingKind;
    nl: string;
    desc: string;
}> = [
    {
        key: 'portfolio',
        nl: 'Portfolio',
        desc: 'Funds, shares and crypto — your most liquid asset.',
    },
    {
        key: 'property',
        nl: 'Real estate',
        desc: 'A house or rental property. Part of the long game.',
    },
    {
        key: 'business',
        nl: 'Business',
        desc: 'A company or stake in one. Usually your highest return and highest risk.',
    },
    {
        key: 'cash',
        nl: 'Cash & reserves',
        desc: 'Immediately accessible. Reassuring, but barely grows.',
    },
    {
        key: 'pension',
        nl: 'Pension',
        desc: 'Truly yours, but locked until you stop working.',
    },
];
