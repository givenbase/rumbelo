import { redirect } from 'next/navigation';

/** `/product/money` is the Geld portal — home dashboard lives at `/`. */
export default function MoneyIndexPage() {
    redirect('/product/money/overview');
}
