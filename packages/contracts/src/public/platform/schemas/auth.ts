import { z } from 'zod';

/**
 * Auth form schemas — shared by website + application (Galighticus `signUpFormSchema` pattern).
 * Keep {@link AUTH_MIN_PASSWORD_LENGTH} in sync with Better Auth `emailAndPassword.minPasswordLength`.
 */

export const AUTH_MIN_PASSWORD_LENGTH = 12;

export const AuthEmail = z.email('Enter a valid email');
/** Maps to Better Auth `user.name` — how we greet you in the product (editable later). */
export const AuthDisplayName = z.string().trim().min(1, 'Display name is required').max(80);
export const AuthFirstName = z.string().trim().min(1, 'First name is required').max(80);
export const AuthLastName = z.string().trim().min(1, 'Last name is required').max(80);
export const AuthPassword = z
    .string()
    .min(
        AUTH_MIN_PASSWORD_LENGTH,
        `Password must be at least ${AUTH_MIN_PASSWORD_LENGTH} characters`
    );

/**
 * Seed Better Auth `user.name` from legal name parts.
 * Display name stays independently editable in settings afterward.
 */
export function composeDisplayName(
    firstName: string,
    middleName?: string | null,
    lastName?: string | null
): string {
    return [firstName, middleName, lastName]
        .map(part => part?.trim())
        .filter((part): part is string => Boolean(part && part.length > 0))
        .join(' ');
}

function emptyToUndefined(value: string | undefined): string | undefined {
    const trimmed = value?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

export const SignInForm = z.object({
    email: AuthEmail,
    password: AuthPassword,
});
export type SignInForm = z.infer<typeof SignInForm>;

/**
 * Full sign-up — first + last required (seed `auth.user.name`); middle/phone/DOB optional.
 * Display name is composed once at signup and can be changed later in settings.
 */
export const SignUpForm = z.object({
    firstName: AuthFirstName,
    middleName: z.string().trim().max(80),
    lastName: AuthLastName,
    email: AuthEmail,
    password: AuthPassword,
    phone: z.string().trim().max(32),
    dateOfBirth: z.union([z.literal(''), z.iso.date()]),
});
export type SignUpForm = z.infer<typeof SignUpForm>;

/** Profile fields forwarded with Better Auth sign-up (not stored on `auth.user`). */
export const SignUpAccountProfile = z.object({
    firstName: AuthFirstName,
    middleName: z.string().trim().max(80).optional(),
    lastName: AuthLastName,
    phone: z.string().trim().max(32).optional(),
    dateOfBirth: z.union([z.literal(''), z.iso.date()]).optional(),
});
export type SignUpAccountProfile = z.infer<typeof SignUpAccountProfile>;

/** Normalize form / body optionals before writing `auth.account`. */
export function toSignUpAccountProfile(values: {
    firstName: string;
    middleName?: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
}): SignUpAccountProfile {
    return {
        firstName: values.firstName.trim(),
        middleName: emptyToUndefined(values.middleName),
        lastName: values.lastName.trim(),
        phone: emptyToUndefined(values.phone),
        dateOfBirth: emptyToUndefined(values.dateOfBirth),
    };
}

/** Landing CTA — shorter gate; full profile is completed on `/sign-up`. */
export const LandingSignUpForm = z.object({
    firstName: AuthFirstName,
    lastName: AuthLastName,
    email: AuthEmail,
    password: AuthPassword,
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
