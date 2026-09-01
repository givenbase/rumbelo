import { redirect } from 'next/navigation';

/** Money/board merged into growth — keep old route working. */
export default function MoneyBoardRedirect() {
  redirect('/growth/board');
}
