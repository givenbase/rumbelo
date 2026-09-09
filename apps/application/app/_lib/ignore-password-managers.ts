/**
 * Attributes that ask browsers + password managers to skip a field/form.
 * Chrome ignores `autocomplete="off"` on identity-like fields — inputs use a
 * non-standard token plus FormInput’s readOnly-until-focus.
 */
export const ignorePasswordManagersForm = {
    autoComplete: 'off',
    'data-1p-ignore': 'true',
    'data-lpignore': 'true',
    'data-bwignore': 'true',
    'data-form-type': 'other',
} as const;

export const ignorePasswordManagers = {
    autoComplete: 'one-time-code',
    autoCorrect: 'off',
    autoCapitalize: 'off',
    spellCheck: false,
    'data-1p-ignore': 'true',
    'data-lpignore': 'true',
    'data-bwignore': 'true',
    'data-form-type': 'other',
} as const;

/** DOM `name` values that trigger Chrome / LastPass identity autofill. */
const AUTOFILL_BAIT_NAMES = new Set([
    'name',
    'username',
    'email',
    'password',
    'login',
    'user',
    'search',
    'first-name',
    'firstname',
    'last-name',
    'lastname',
    'full-name',
    'fullname',
    'address',
]);

/** Remap bait `name` attrs so managers don’t treat the control as a person field. */
export function safeAutofillName(name: string | undefined): string | undefined {
    if (!name) return name;
    if (AUTOFILL_BAIT_NAMES.has(name.toLowerCase())) return `rumbelo-${name}`;
    return name;
}
