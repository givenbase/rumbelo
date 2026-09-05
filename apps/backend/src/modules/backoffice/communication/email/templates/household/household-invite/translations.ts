import type { EmailLanguageObject } from '../../../utils/email-translation.util';

export const languageObject: EmailLanguageObject = {
    en: {
        'email.household.invite.header.preview_text':
            'You are invited to share a household on Rumbelo',
        'email.household.invite.header.title': 'Household invite — Rumbelo',
        'email.household.invite.header.heading': 'You are invited',
        'email.household.invite.body.message':
            '{who} invited you to the household {household} as {role}.',
        'email.household.invite.body.button': 'Open invitation',
        'email.household.invite.body.link_hint':
            'Button not working? Paste this link in your browser:',
    },
    nl: {
        'email.household.invite.header.preview_text':
            'Je bent uitgenodigd voor een huishouden op Rumbelo',
        'email.household.invite.header.title': 'Huishouden uitnodiging — Rumbelo',
        'email.household.invite.header.heading': 'Je bent uitgenodigd',
        'email.household.invite.body.message':
            '{who} nodigt je uit voor het huishouden {household} als {role}.',
        'email.household.invite.body.button': 'Open uitnodiging',
        'email.household.invite.body.link_hint':
            'Werkt de knop niet? Plak deze link in je browser:',
    },
};
