import type { EmailLanguageObject } from '../../../utils/email-translation.util';

export const languageObject: EmailLanguageObject = {
    en: {
        'email.auth.verification.header.preview_text':
            'Confirm your email to finish setting up Rumtelo',
        'email.auth.verification.header.title': 'Verify your email — Rumtelo',
        'email.auth.verification.header.heading': 'Confirm your email',
        'email.auth.verification.body.greeting': 'Hi {firstName},',
        'email.auth.verification.body.message':
            'Welcome to Rumtelo. Confirm your email so we can recover your account if you ever lose access.',
        'email.auth.verification.body.button': 'Verify email',
        'email.auth.verification.body.expiration_note':
            'This link expires in {expiresInHours} hours.',
        'email.auth.verification.body.renewal_note':
            'After that, you can request a new verification link from the website.',
        'email.auth.verification.body.safety_note':
            'If you did not create a Rumtelo account, you can safely ignore this message.',
    },
    nl: {
        'email.auth.verification.header.preview_text': 'Bevestig je e-mail om Rumtelo af te ronden',
        'email.auth.verification.header.title': 'Verifieer je e-mail — Rumtelo',
        'email.auth.verification.header.heading': 'Bevestig je e-mail',
        'email.auth.verification.body.greeting': 'Hallo {firstName},',
        'email.auth.verification.body.message':
            'Welkom bij Rumtelo. Bevestig je e-mail zodat we je account kunnen herstellen als je de toegang verliest.',
        'email.auth.verification.body.button': 'E-mail verifiëren',
        'email.auth.verification.body.expiration_note':
            'Deze link verloopt over {expiresInHours} uur.',
        'email.auth.verification.body.renewal_note':
            'Daarna kun je op de website een nieuwe verificatielink aanvragen.',
        'email.auth.verification.body.safety_note':
            'Als je geen Rumtelo-account hebt aangemaakt, kun je deze e-mail negeren.',
    },
};
