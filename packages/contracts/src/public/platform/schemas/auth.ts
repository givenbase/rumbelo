import { z } from 'zod';

/**
 * Auth form schemas — shared by website + application (Galighticus `signUpFormSchema` pattern).
 * Keep {@link AUTH_MIN_PASSWORD_LENGTH} in sync with Better Auth `emailAndPassword.minPasswordLength`.
 */

export const AUTH_MIN_PASSWORD_LENGTH = 12;

export const AuthEmail = z.email('Enter a valid email');
export const AuthName = z.string().trim().min(1, 'Name is required').max(80);
export const AuthPassword = z
    .string()
    .min(
        AUTH_MIN_PASSWORD_LENGTH,
        `Password must be at least ${AUTH_MIN_PASSWORD_LENGTH} characters`
    );

export const SignInForm = z.object({
    email: AuthEmail,
    password: AuthPassword,
});
export type SignInForm = z.infer<typeof SignInForm>;

export const SignUpForm = z.object({
    name: AuthName,
    email: AuthEmail,
    password: AuthPassword,
});
export type SignUpForm = z.infer<typeof SignUpForm>;

/** Landing CTA — same credentials as sign-up, plus terms gate before hand-off. */
export const LandingSignUpForm = SignUpForm.extend({
    terms: z.boolean().refine(value => value, { message: 'Please agree to the terms.' }),
});
export type LandingSignUpForm = z.infer<typeof LandingSignUpForm>;

export const ForgotPasswordForm = z.object({
    email: AuthEmail,
});
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordForm>;

export const ResetPasswordForm = z
    .object({
        password: AuthPassword,
        confirm: z.string(),
    })
    .refine(data => data.password === data.confirm, {
        message: 'Passwords do not match',
        path: ['confirm'],
    });
export type ResetPasswordForm = z.infer<typeof ResetPasswordForm>;

export const VerifyEmailForm = z.object({
    email: AuthEmail,
});
export type VerifyEmailForm = z.infer<typeof VerifyEmailForm>;
