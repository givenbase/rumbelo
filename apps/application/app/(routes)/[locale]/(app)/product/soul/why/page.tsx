import { redirect } from 'next/navigation';

/** Canonical foundation page is /product/why. */
export default function SoulWhyRedirect() {
    redirect('/product/why');
}
