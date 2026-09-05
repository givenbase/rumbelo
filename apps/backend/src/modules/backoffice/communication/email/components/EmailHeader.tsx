import { Link, Section, Text } from '@react-email/components';

import * as React from 'react';

import { emailBrand, emailFonts, emailLayout, emailRadii } from '../styles/email-tokens';
import { getTheme } from '../styles/theme-styles';
import { EMAIL_BRAND } from '../utils/brand.constants';

interface EmailHeaderProps {
    darkMode?: boolean;
    showLogo?: boolean;
    websiteUrl?: string;
}

const EmailHeader: React.FC<EmailHeaderProps> = ({
    websiteUrl = EMAIL_BRAND.websiteUrl,
    darkMode = false,
    showLogo = true,
}) => {
    if (!showLogo) return null;

    const theme = getTheme(darkMode);

    return (
        <Section style={{ margin: 0, padding: 0 }}>
            <div
                style={{
                    backgroundColor: emailBrand.accent,
                    fontSize: '3px',
                    height: '3px',
                    lineHeight: '3px',
                }}>
                &nbsp;
            </div>
            <Section
                style={{
                    backgroundColor: theme.colors.background,
                    borderBottom: `1px solid ${theme.colors.border}`,
                    padding: `24px ${emailLayout.contentInset} 20px`,
                    textAlign: 'center',
                }}>
                <Link href={websiteUrl} style={{ textDecoration: 'none', display: 'inline-block' }}>
                    <div
                        style={{
                            backgroundColor: emailBrand.accent,
                            borderRadius: emailRadii.sm,
                            color: emailBrand.buttonText,
                            display: 'inline-block',
                            fontFamily: emailFonts.display,
                            fontSize: '14px',
                            fontWeight: 600,
                            height: '32px',
                            lineHeight: '32px',
                            textAlign: 'center',
                            width: '32px',
                        }}>
                        R
                    </div>
                </Link>
                <Text
                    style={{
                        color: emailBrand.ink,
                        fontFamily: emailFonts.display,
                        fontSize: '18px',
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        lineHeight: '24px',
                        margin: '12px 0 4px',
                    }}>
                    {EMAIL_BRAND.name}
                </Text>
                <Text
                    style={{
                        color: darkMode ? '#5eead4' : emailBrand.inkMuted,
                        fontFamily: emailFonts.sans,
                        fontSize: '12px',
                        lineHeight: '16px',
                        margin: '0',
                    }}>
                    {EMAIL_BRAND.tagline}
                </Text>
            </Section>
        </Section>
    );
};

export default EmailHeader;
