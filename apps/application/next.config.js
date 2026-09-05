/** @type {import('next').NextConfig} */
const nextConfig = {
    // Next regenerates AGENTS.md/CLAUDE.md on every dev boot; we keep our own docs.
    agentRules: false,
};

export default nextConfig;
