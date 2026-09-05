import type { HouseholdInviteEmailInput } from '../email.types';

import { escapeHtml, renderEmailLayout } from './layout';

export function renderHouseholdInviteEmail(input: HouseholdInviteEmailInput): {
    subject: string;
    html: string;
    text: string;
} {
    const who = input.inviterName ? escapeHtml(input.inviterName) : 'Iemand';
    const household = escapeHtml(input.householdName);
    const role = input.role ? escapeHtml(input.role.toLowerCase()) : 'member';
    const url = escapeHtml(input.inviteUrl);

    const subject = `Uitnodiging voor ${input.householdName} op Rumbelo`;

    const bodyHtml = `
      <p style="margin:0 0 16px;font-size:22px;line-height:1.3;">Je bent uitgenodigd</p>
      <p style="margin:0 0 16px;">${who} nodigt je uit voor het huishouden <strong>${household}</strong> als ${role}.</p>
      <p style="margin:0 0 24px;">
        <a href="${url}" style="display:inline-block;padding:12px 18px;background:#1c1917;color:#fffaf4;text-decoration:none;">
          Open uitnodiging
        </a>
      </p>
      <p style="margin:0;font-size:14px;color:#78716c;">Werkt de knop niet? Plak deze link in je browser:<br />${url}</p>
    `;

    const text = [
        `Je bent uitgenodigd voor ${input.householdName} op Rumbelo.`,
        input.inviterName ? `${input.inviterName} nodigt je uit als ${role}.` : `Rol: ${role}.`,
        `Open: ${input.inviteUrl}`,
    ].join('\n\n');

    return {
        subject,
        html: renderEmailLayout({
            title: subject,
            preheader: `Uitnodiging voor ${input.householdName}`,
            bodyHtml,
        }),
        text,
    };
}
