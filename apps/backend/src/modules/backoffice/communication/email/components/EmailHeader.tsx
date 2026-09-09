import { Img, Link, Section, Text } from '@react-email/components';

import * as React from 'react';

import { emailBrand, emailFonts, emailLayout } from '../styles/email-tokens';
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
                    <Img
                        src={`${websiteUrl.replace(/\/$/, '')}${
                            darkMode
                                ? EMAIL_BRAND.logoWordmarkOnDark
                                : EMAIL_BRAND.logoWordmarkOnLight
                        }`}
                        alt={EMAIL_BRAND.name}
                        width="192"
                        height="32"
                        style={{
                            display: 'block',
                            height: '32px',
                            margin: '0 auto',
                            width: '192px',
                        }}
                    />
                </Link>
                <Text
                    style={{
                        color: darkMode ? '#5eead4' : emailBrand.inkMuted,
                        fontFamily: emailFonts.sans,
                        fontSize: '12px',
                        lineHeight: '16px',
                        margin: '12px 0 0',
                    }}>
                    {EMAIL_BRAND.tagline}
                </Text>
            </Section>
        </Section>
    );
};

export default EmailHeader;
