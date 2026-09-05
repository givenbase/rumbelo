import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Next regenerates AGENTS.md/CLAUDE.md on every dev boot; we keep our own docs.
    agentRules: false,
};

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

export default withNextIntl(nextConfig);
