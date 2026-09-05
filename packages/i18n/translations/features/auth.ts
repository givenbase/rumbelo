/** Auth screens — sign-in / sign-up / verify chrome. */
const auth = {
    sign_in: {
        title: 'Welcome back',
        subtitle: 'Stop wondering where it went.',
        verification: {
            title: 'Verify your email',
            required: 'Confirm {email} before signing in. Check your inbox for the link.',
            sent: 'Verification email sent to {email}.',
            resend: 'Resend email',
            resend_in: 'Resend in {seconds}s',
            dismiss: 'Dismiss',
        },
    },
    sign_up: {
        title: 'Stop wondering where it went.',
        subtitle: 'Six jars. One calm overview.',
    },
    /** Pending verification gate — email today; phone / etc. later. */
    verify: {
        title: 'Almost there',
        subtitle:
            'We sent a verification link to {email}. Confirm it so we can recover your account if you lose access.',
        subtitle_no_target:
            'Confirm the verification we sent so we can recover your account if you lose access.',
        resend: 'Resend email',
        resend_in: 'Resend in {seconds}s',
        sent: 'Sent again.',
        continue: 'Continue to app',
        back_to_sign_in: 'Back to sign in',
    },
    actions: {
        log_out: 'Sign out',
        try_again: 'Try again',
        cancel: 'Cancel',
    },
    notifications: {
        login_success: 'Signed in',
        login_failure: 'Could not sign in',
        logout_success: 'Signed out',
        logout_failure: 'Could not sign out',
    },
} as const;

export default auth;
