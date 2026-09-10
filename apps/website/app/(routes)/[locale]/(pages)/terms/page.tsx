import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal/legal-page';

export const metadata: Metadata = {
    title: 'Terms of Service · Rumtelo',
    description: 'Terms for using Rumtelo.',
};

export default function TermsPage() {
    return (
        <LegalPage title="Terms of Service" updated="10 September 2026">
            <p>
                By creating an account or using Rumtelo, you agree to these terms. If you do not
                agree, do not use the service.
            </p>

            <h2>What Rumtelo is</h2>
            <p>
                Rumtelo is a personal overview and coach for money, growth, energy and soul. It is
                education and tooling — not a bank, broker, or licensed financial adviser.
                Suggestions are not personal investment advice.
            </p>

            <h2>Your account</h2>
            <ul>
                <li>You must provide accurate registration details and keep your login safe.</li>
                <li>You are responsible for activity under your account.</li>
                <li>Household members you invite share access to that household’s data.</li>
            </ul>

            <h2>Acceptable use</h2>
            <p>
                Use Rumtelo lawfully. Do not attempt to break security, scrape the service, abuse
                other users, or reverse-engineer the product beyond what the law allows.
            </p>

            <h2>Plans and billing</h2>
            <p>
                Basic may be free. Paid plans (Plus, Max) renew until cancelled. Prices include
                applicable VAT where shown. Cancel anytime; content you entered stays readable
                unless you delete the account.
            </p>

            <h2>Intellectual property</h2>
            <p>
                Rumtelo’s software, brand and design belong to us. Your household data belongs to
                you. Books and methods we reference remain the property of their authors — Rumtelo
                is independent and not affiliated with or endorsed by them.
            </p>

            <h2>Availability</h2>
            <p>
                We aim for a reliable service but do not guarantee uninterrupted access. Features
                marked “coming” (e.g. live bank sync, devices) may ship later or change.
            </p>

            <h2>Liability</h2>
            <p>
                To the extent allowed by Dutch and EU law, Rumtelo is provided “as is.” We are not
                liable for decisions you make with your money based on the product. Nothing in these
                terms limits liability that cannot be limited by law.
            </p>

            <h2>Governing law</h2>
            <p>
                These terms are governed by the laws of the Netherlands. Disputes are subject to the
                courts of Amsterdam, without prejudice to mandatory consumer protections.
            </p>

            <h2>Contact</h2>
            <p>
                <a href="mailto:support@rumtelo.com" className="text-accent hover:underline">
                    support@rumtelo.com
                </a>
            </p>
        </LegalPage>
    );
}
