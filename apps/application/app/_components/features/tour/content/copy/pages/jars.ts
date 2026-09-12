/** Jars help + tour — future `features.tour.pages.jars.*`. */
const jars = {
    title: 'Jars',
    sections: {
        what_for: {
            heading: 'What this is for',
            body: 'Six jars hold your monthly money by purpose. Percentages must add to 100%. Allocated, spent, and fixed commitments decide what is still available.',
        },
        how: {
            heading: 'How it works',
            body: 'Available = allocated − spent − fixed OUT on that jar. Overspent means commitments and spending already ate the envelope. To ask what a raise would do to these jars, use the simulator on Growth → Income.',
        },
    },
    steps: {
        toolbar: {
            title: 'Add · Move',
            content:
                'Log a transaction in or out, or move money between jars when a month needs it.',
        },
        list: {
            title: 'Your six jars',
            content: 'Each row is a job for money. Tap for fixed costs, spends, and what’s left.',
        },
    },
} as const;

export default jars;
