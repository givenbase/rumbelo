import { redirect } from 'next/navigation';

/** The foundation page moved to /why — keep this route working. */
export default function SoulWhyRedirect() {
  redirect('/why');
}
