import { StatusPage } from '@rumtelo/ui';

export default function NotFound() {
    return (
        <StatusPage type="not-found" statusCode={404} homeHref="/" homeLabel="Back to dashboard" />
    );
}
