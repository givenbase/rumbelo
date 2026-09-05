/**
 * Shared toast / feedback copy.
 * Prefer feature-specific strings when the message names a domain entity.
 */
const message = {
    success: {
        saved: 'Changes saved',
        deleted: 'Deleted',
        created: '{entity} created',
        updated: '{entity} updated',
    },
    error: {
        generic: 'Something went wrong',
        save_failed: 'Could not save',
        delete_failed: 'Could not delete',
        load_failed: 'Could not load',
        sign_in_required: 'Sign in to continue',
    },
} as const;

export default message;
