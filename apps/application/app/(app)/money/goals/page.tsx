import { redirect } from 'next/navigation';

/** Money/goals merged into growth — keep old route working. */
export default function MoneyGoalsRedirect() {
    redirect('/growth/goals');
}
