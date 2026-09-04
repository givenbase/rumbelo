import { createClient } from '../src/client/index.ts';

const orig = globalThis.fetch;
globalThis.fetch = async (input, init) => {
    const req = input instanceof Request ? input : new Request(String(input), init);
    console.log('URL', req.url);
    console.log('METHOD', req.method);
    console.log('BODY', await req.clone().text());
    return new Response(
        JSON.stringify({
            id: 'x',
            name: 'x',
            slug: 'x',
            currency: 'EUR',
            periodStartDay: 1,
            createdAt: new Date().toISOString(),
        }),
        { status: 200, headers: { 'content-type': 'application/json' } }
    );
};

const c = createClient({ url: 'http://localhost:3000/api/backend' });
await c.household.onboard({
    householdName: 'Test',
    currency: 'EUR',
    locale: 'nl',
    monthlyNetIncome: 100,
    split: [{ key: 'NECESSITIES', percentage: 100 }],
    why: null,
});
globalThis.fetch = orig;
