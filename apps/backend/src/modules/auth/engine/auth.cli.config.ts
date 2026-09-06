import { loadEnv } from '../../../common/config/env.config';
import { loadEnvFiles } from '../../../common/config/load-env';
import { createAuth } from './auth.config';

loadEnvFiles();

/** Used by `@better-auth/cli migrate` only — not imported by Nest bootstrap. */
export default createAuth(loadEnv());
