import { basicTest, plusTest, maxTest, expect } from '../../../../shared/fixtures';

const LOCKED_COPY = /Available in the (Plus|Max) plan|Upgrade to (Plus|Max)|belongs in (Plus|Max)/i;

basicTest.describe('plan gating @plan', () => {
    basicTest('Basic sees debt locked', async ({ personaPage }) => {
        await personaPage.goto('/product/money/debts');
        await expect(
            personaPage.getByRole('region', { name: /plan upgrade required/i })
        ).toBeVisible({ timeout: 30_000 });
        await expect(personaPage.getByText(LOCKED_COPY).first()).toBeVisible();
    });

    basicTest('Basic can open growth income', async ({ personaPage }) => {
        await personaPage.goto('/product/growth/income');
        await expect(personaPage).not.toHaveURL(/sign-in/);
        await expect(
            personaPage.getByRole('region', { name: /plan upgrade required/i })
        ).toHaveCount(0);
    });

    basicTest('Basic sees net worth locked', async ({ personaPage }) => {
        await personaPage.goto('/product/growth/net-worth');
        await expect(
            personaPage.getByRole('region', { name: /plan upgrade required/i })
        ).toBeVisible({ timeout: 30_000 });
        await expect(personaPage.getByRole('button', { name: /\+ Add asset/i })).toHaveCount(0);
    });

    basicTest('Basic can open goals', async ({ personaPage }) => {
        await personaPage.goto('/product/growth/goals');
        await expect(personaPage).not.toHaveURL(/sign-in/);
        await expect(
            personaPage.getByRole('region', { name: /plan upgrade required/i })
        ).toHaveCount(0);
    });

    basicTest('Basic sees training locked', async ({ personaPage }) => {
        await personaPage.goto('/product/energy/train');
        await expect(
            personaPage.getByRole('region', { name: /plan upgrade required/i })
        ).toBeVisible({ timeout: 30_000 });
    });
});

plusTest.describe('plan gating @plan', () => {
    plusTest('Plus can open debts', async ({ personaPage }) => {
        await personaPage.goto('/product/money/debts');
        await expect(personaPage).not.toHaveURL(/sign-in/);
        await expect(
            personaPage.getByRole('region', { name: /plan upgrade required/i })
        ).toHaveCount(0);
    });

    plusTest('Plus sees Max screens locked', async ({ personaPage }) => {
        await personaPage.goto('/product/growth/net-worth');
        await expect(
            personaPage.getByRole('region', { name: /plan upgrade required/i })
        ).toBeVisible({ timeout: 30_000 });
        await expect(personaPage.getByRole('button', { name: /\+ Add asset/i })).toHaveCount(0);
    });

    plusTest('Plus can open goals', async ({ personaPage }) => {
        await personaPage.goto('/product/growth/goals');
        await expect(personaPage).not.toHaveURL(/sign-in/);
        await expect(
            personaPage.getByRole('region', { name: /plan upgrade required/i })
        ).toHaveCount(0);
    });
});

maxTest.describe('plan gating @plan', () => {
    maxTest('Max can open income', async ({ personaPage }) => {
        await personaPage.goto('/product/growth/income');
        await expect(personaPage).not.toHaveURL(/sign-in/);
        await expect(
            personaPage.getByRole('region', { name: /plan upgrade required/i })
        ).toHaveCount(0);
    });

    maxTest('Max can open net worth', async ({ personaPage }) => {
        await personaPage.goto('/product/growth/net-worth');
        await expect(personaPage).not.toHaveURL(/sign-in/);
        await expect(
            personaPage.getByRole('region', { name: /plan upgrade required/i })
        ).toHaveCount(0);
    });
});
