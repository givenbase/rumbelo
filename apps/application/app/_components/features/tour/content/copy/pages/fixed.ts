/** Fixed costs help + tour — future `features.tour.pages.fixed.*`. */
const fixed = {
    title: 'Fixed costs & income',
    sections: {
        what_for: {
            heading: 'What this page is for',
            body: 'OUT is recurring bills linked to jars. IN is the same income sources that feed the split. Set them once; jar coverage and leftover update automatically.',
        },
        out_vs_in: {
            heading: 'OUT vs IN',
            body: 'OUT lists active fixed costs (rent, insurance, subscriptions). IN lists pay that lands every period. Leftover after costs is monthly net minus fixed OUT.',
        },
        jars_use: {
            heading: 'How jars use this',
            body: 'Fixed OUT reduces available in that jar. Income is split by percentage into jars when money arrives — this screen is the plan, not the ledger.',
        },
    },
    steps: {
        tabs: {
            title: 'Out vs In',
            content:
                'Switch between monthly bills (Out) and income sources (In). Leftover after costs shows next to + Add.',
        },
        list: {
            title: 'The list',
            content: 'Out: fixed costs by jar. In: pay that funds the split. Tap a row to edit.',
        },
    },
} as const;

export default fixed;
