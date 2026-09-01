import { redirect } from 'next/navigation';

/** Assets live on Vermogen — keep /growth/assets working for create routes. */
export default function AssetsIndexRedirect() {
    redirect('/growth/board');
}
