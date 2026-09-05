import { basicTest, plusTest, maxTest, expect } from '../../../../shared/fixtures';

basicTest.describe('plan gating @plan', () => {
    basicTest('Basic sees debt locked', async ({ personaPage }) => {
        await personaPage.goto('/money/debts');
        await expect(
            personaPage.getByText(/belongs in Plus|Upgrade to Plus|Debt belongs/i).first()
        ).toBeVisible({ timeout: 30_000 });
    });
});

plusTest.describe('plan gating @plan', () => {
    plusTest('Plus can open debts', async ({ personaPage }) => {
        await personaPage.goto('/money/debts');
        await expect(personaPage).not.toHaveURL(/sign-in/);
        await expect(personaPage.getByText(/Upgrade to Plus/i)).toHaveCount(0);
    });
});

maxTest.describe('plan gating @plan', () => {
    maxTest('Max can open income', async ({ personaPage }) => {
        await personaPage.goto('/growth/income');
        await expect(personaPage).not.toHaveURL(/sign-in/);
        await expect(personaPage.getByText(/Upgrade to Max/i)).toHaveCount(0);
    });
});
