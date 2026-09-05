import { Heading, Section, Text } from '@react-email/components';

import * as React from 'react';

import Button from '../../../components/Button';
import EmailLayout from '../../../components/EmailLayout';
import { createEmailStyles } from '../../../styles';
import { createEmailTranslator } from '../../../utils/email-translation.util';

import { languageObject } from './translations';

export interface PasswordResetTemplateProps {
    darkMode?: boolean;
    expiresInHours?: number;
    firstName: string;
    locale?: string;
    resetUrl: string;
}

/**
 * Password reset — Better Auth `emailAndPassword.sendResetPassword`.
 */
export const PasswordResetTemplate: React.FC<PasswordResetTemplateProps> = ({
    firstName,
    resetUrl,
    expiresInHours = 1,
    darkMode = false,
    locale = 'en',
}) => {
    const t = createEmailTranslator(languageObject, locale);
    const styles = createEmailStyles(darkMode);

    return (
        <EmailLayout
            darkMode={darkMode}
            previewText={t('email.auth.password_reset.header.preview_text')}
            title={t('email.auth.password_reset.header.title')}>
            <Heading style={styles.heading}>{t('email.auth.password_reset.header.heading')}</Heading>

            <Section style={styles.section}>
                <Text style={styles.text}>
                    {t('email.auth.password_reset.body.greeting', { firstName })}
                </Text>
                <Text style={styles.text}>{t('email.auth.password_reset.body.message')}</Text>

                <Button darkMode={darkMode} href={resetUrl} size="large">
                    {t('email.auth.password_reset.body.button')}
                </Button>

                <Text style={styles.noteText}>
                    {t('email.auth.password_reset.body.expiration_note', { expiresInHours })}
                </Text>
                <Text style={styles.smallText}>
                    {t('email.auth.password_reset.body.safety_note')}
                </Text>
            </Section>
        </EmailLayout>
    );
};

export default PasswordResetTemplate;
