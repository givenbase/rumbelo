import { redirect } from 'next/navigation';

/** `/money` is the Geld portal — home dashboard lives at `/`. */
export default function MoneyIndexPage() {
  redirect('/money/overview');
}
