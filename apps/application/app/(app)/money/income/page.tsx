import { redirect } from 'next/navigation';

/** Money/income merged into growth — keep old route working. */
export default function MoneyIncomeRedirect() {
    redirect('/growth/income');
}
