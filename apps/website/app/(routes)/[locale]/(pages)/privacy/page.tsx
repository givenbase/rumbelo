import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal/legal-page';

export const metadata: Metadata = {
    title: 'Privacy Policy · Rumtelo',
    description: 'How Rumtelo collects, uses, and protects your data.',
};

export default function PrivacyPage() {
    return (
        <LegalPage title="Privacy Policy" updated="10 September 2026">
            <p>
                Rumtelo (“we”, “us”) is built in Amsterdam and hosts data in the EU. This policy
                explains what we collect, why, and your rights under the GDPR.
            </p>

            <h2>Who we are</h2>
            <p>
                Rumtelo is operated from Amsterdam, the Netherlands. Contact:{' '}
                <a href="mailto:support@rumtelo.com" className="text-accent hover:underline">
                    support@rumtelo.com
                </a>
                .
            </p>

            <h2>What we collect</h2>
            <ul>
                <li>Account details you provide (name, email, password hash).</li>
                <li>
                    Household money data you enter or import (jars, transactions, goals, debt, and
                    related product data).
                </li>
                <li>
                    Optional energy and soul practice data you choose to log (sleep, training,
                    intention, and similar).
                </li>
                <li>Basic technical logs needed to keep the service secure and working.</li>
            </ul>

            <h2>How we use it</h2>
            <p>
                To run your account, show your overview and Coach tips, improve the product, and
                meet legal obligations. We do not sell your personal data.
            </p>

            <h2>Bank data</h2>
            <p>
                Bank connections are optional. When live bank sync is available, access is read-only
                via a PSD2-licensed provider, and only after you connect it yourself. Statement
                import is always under your control.
            </p>

            <h2>Where it lives</h2>
            <p>
                Data is hosted on EU servers (Amsterdam region), encrypted in transit (TLS) and at
                rest. Processors we use act under data-processing terms.
            </p>

            <h2>Your rights</h2>
            <p>
                You can access, correct, export, or delete your data. Cancel a paid plan and your
                jars, transactions and goals stay readable unless you ask us to delete the account.
                To exercise rights, email support@rumtelo.com.
            </p>

            <h2>Retention</h2>
            <p>
                We keep account and household data while your account is active, and for a limited
                period after deletion where the law requires (e.g. billing records).
            </p>

            <h2>Changes</h2>
            <p>
                We may update this policy. Material changes will be noted on this page with a new
                “Last updated” date.
            </p>
        </LegalPage>
    );
}
