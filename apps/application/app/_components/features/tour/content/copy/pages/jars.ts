/** Jars help + tour — future `features.tour.pages.jars.*`. */
const jars = {
    title: 'Jars',
    sections: {
        what_for: {
            heading: 'What this page is for',
            body: 'Six jars hold your monthly money by purpose. Percentages must add to 100%. Allocated, spent, and fixed commitments decide what is still available.',
        },
        coverage: {
            heading: 'Coverage',
            body: 'Available = allocated − spent − fixed OUT on that jar. Overspent means commitments and spending already ate the envelope.',
        },
        simulator: {
            heading: 'Simulator',
            body: 'What-if income shows how a different monthly net would fund each jar and how long a Save goal might take at that pace.',
        },
    },
    steps: {
        tabs: {
            title: 'Jars · Simulator',
            content:
                'Jars shows this period’s envelopes. Simulator asks what if income were higher or lower.',
        },
        list: {
            title: 'Your six jars',
            content: 'Each row is a job for money. Tap for fixed costs, spends, and what’s left.',
        },
    },
} as const;

export default jars;
