import { defineConfig, devices } from '@playwright/test';

import { e2eEnv } from './shared/env';

const isCi = Boolean(process.env.CI);

export default defineConfig({
    testDir: './modules',
    fullyParallel: false,
    forbidOnly: isCi,
    retries: isCi ? 2 : 1,
    workers: 1,
    timeout: 120_000,
    expect: { timeout: 15_000 },
    reporter: [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ...(isCi ? [['github'] as const] : []),
    ],
    use: {
        baseURL: e2eEnv.appUrl,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        actionTimeout: 20_000,
        navigationTimeout: 90_000,
        locale: 'en-US',
        timezoneId: 'Europe/Amsterdam',
    },
    projects: [
        {
            name: 'application-chromium',
            testMatch: /modules\/application\/specs\/.*\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                baseURL: e2eEnv.appUrl,
            },
        },
    ],
});
