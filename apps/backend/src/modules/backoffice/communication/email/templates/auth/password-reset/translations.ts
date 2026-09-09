import type { EmailLanguageObject } from '../../../utils/email-translation.util';

export const languageObject: EmailLanguageObject = {
    en: {
        'email.auth.password_reset.header.preview_text': 'Reset your Rumtelo password',
        'email.auth.password_reset.header.title': 'Reset your password — Rumtelo',
        'email.auth.password_reset.header.heading': 'Reset your password',
        'email.auth.password_reset.body.greeting': 'Hi {firstName},',
        'email.auth.password_reset.body.message':
            'We received a request to reset your Rumtelo password. Use the button below to choose a new one.',
        'email.auth.password_reset.body.button': 'Choose new password',
        'email.auth.password_reset.body.expiration_note':
            'This link expires in {expiresInHours} hours.',
        'email.auth.password_reset.body.safety_note':
            'If you did not ask to reset your password, you can safely ignore this message.',
    },
    nl: {
        'email.auth.password_reset.header.preview_text': 'Reset je Rumtelo-wachtwoord',
        'email.auth.password_reset.header.title': 'Wachtwoord resetten — Rumtelo',
        'email.auth.password_reset.header.heading': 'Wachtwoord resetten',
        'email.auth.password_reset.body.greeting': 'Hallo {firstName},',
        'email.auth.password_reset.body.message':
            'We ontvingen een verzoek om je Rumtelo-wachtwoord te resetten. Gebruik de knop hieronder om een nieuw wachtwoord te kiezen.',
        'email.auth.password_reset.body.button': 'Nieuw wachtwoord kiezen',
        'email.auth.password_reset.body.expiration_note':
            'Deze link verloopt over {expiresInHours} uur.',
        'email.auth.password_reset.body.safety_note':
            'Als je geen reset hebt aangevraagd, kun je deze e-mail negeren.',
    },
};
