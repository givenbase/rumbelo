import type { Metadata } from 'next';
import Link from 'next/link';

import { LegalPage } from '@/components/legal/legal-page';

export const metadata: Metadata = {
    title: 'Data Processing · Rumtelo',
    description: 'How Rumtelo processes personal data as controller and with processors.',
};

export default function DataProcessingPage() {
    return (
        <LegalPage title="Data Processing" updated="10 September 2026">
            <p>
                This page summarises how Rumtelo processes personal data under the GDPR. For the
                full picture, also read our{' '}
                <Link href="/privacy" className="text-accent hover:underline">
                    Privacy Policy
                </Link>
                .
            </p>

            <h2>Roles</h2>
            <p>
                For your Rumtelo account and household data, Rumtelo acts as the{' '}
                <strong className="font-medium text-fg">data controller</strong>. When we use
                infrastructure or payment providers, they act as processors under contract.
            </p>

            <h2>Purposes and legal bases</h2>
            <ul>
                <li>
                    <strong className="font-medium text-fg">Contract</strong> — create and run your
                    account, show jars, Coach tips, and product features you use.
                </li>
                <li>
                    <strong className="font-medium text-fg">Legitimate interest</strong> — security,
                    fraud prevention, product improvement (with safeguards).
                </li>
                <li>
                    <strong className="font-medium text-fg">Consent</strong> — optional bank connect
                    or marketing where required.
                </li>
                <li>
                    <strong className="font-medium text-fg">Legal obligation</strong> — tax and
                    accounting records for paid plans.
                </li>
            </ul>

            <h2>Categories of data</h2>
            <p>
                Identity and contact data; authentication credentials (hashed); household financial
                and practice data you enter or import; technical logs.
            </p>

            <h2>Processors (typical)</h2>
            <ul>
                <li>EU cloud hosting (application, database, backups) — Amsterdam region.</li>
                <li>Email delivery for verification and account messages.</li>
                <li>Payment processor for paid plans (card details never stored by Rumtelo).</li>
                <li>
                    Optional PSD2/AIS provider for live bank sync when enabled — read-only, after
                    you connect.
                </li>
            </ul>

            <h2>International transfers</h2>
            <p>
                We prefer EU processing. If a processor transfers data outside the EEA, we require
                appropriate safeguards (e.g. Standard Contractual Clauses).
            </p>

            <h2>Subprocessors and changes</h2>
            <p>
                Processor list may change as the product grows. Material changes that affect how
                your data is processed will be reflected here or in the Privacy Policy.
            </p>

            <h2>Contact / DPO</h2>
            <p>
                Privacy requests:{' '}
                <a href="mailto:support@rumtelo.com" className="text-accent hover:underline">
                    support@rumtelo.com
                </a>
                . You may also lodge a complaint with the Dutch Autoriteit Persoonsgegevens.
            </p>
        </LegalPage>
    );
}
