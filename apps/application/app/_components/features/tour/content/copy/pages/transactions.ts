/** Transactions help — future `features.tour.pages.transactions.*`. */
const transactions = {
    title: 'Transactions',
    sections: {
        what_for: {
            heading: 'What this is for',
            body: 'The ledger for money that already moved — Out for spend, In for gifts, refunds, and jar top-ups. Sorting here keeps each jar honest.',
        },
        how: {
            heading: 'How it works',
            body: 'Pick Out or In, say what it was, choose a jar, and save. Inbox items wait until you sort them. Edits update the same period’s available balance.',
        },
    },
} as const;

export default transactions;
