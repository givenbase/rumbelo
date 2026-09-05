/** Auth screens — sign-in / sign-up chrome. */
const auth = {
    sign_in: {
        title: 'Welcome back',
        subtitle: 'Stop wondering where it went.',
    },
    sign_up: {
        title: 'Stop wondering where it went.',
        subtitle: 'Six jars. One calm overview.',
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
