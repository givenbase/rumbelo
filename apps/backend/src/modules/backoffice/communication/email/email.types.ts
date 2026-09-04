export type EmailProvider = 'resend' | 'memory';

export type SendEmailInput = {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    from?: string;
    replyTo?: string;
};

export type HouseholdInviteEmailInput = {
    to: string;
    householdName: string;
    inviteUrl: string;
    inviterName?: string;
    role?: string;
};
