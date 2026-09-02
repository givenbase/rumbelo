import { Suspense } from 'react';

import { SignInForm } from './_components/sign-in-form';

export const metadata = { title: 'Sign in — Rumbelo' };

export default function SignInPage() {
    return (
        <Suspense fallback={null}>
            <SignInForm />
        </Suspense>
    );
}
