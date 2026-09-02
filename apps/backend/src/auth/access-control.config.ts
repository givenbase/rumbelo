import { createAccessControl } from 'better-auth/plugins/access';
import {
    adminAc,
    defaultStatements,
    memberAc,
    ownerAc,
} from 'better-auth/plugins/organization/access';

/**
 * Household roles for the organization plugin.
 *
 * Better Auth's defaults stop at owner/admin/member, and "member" is our PARTNER
 * tier. VIEWER needs to be a real role — someone a household invites to look at
 * the board without the power to change members or invitations — so we define it
 * here instead of silently downgrading it to member at invite time.
 */
export const householdAccessControl = createAccessControl(defaultStatements);

export const householdRoles = {
    owner: householdAccessControl.newRole(ownerAc.statements),
    admin: householdAccessControl.newRole(adminAc.statements),
    member: householdAccessControl.newRole(memberAc.statements),
    /** Read-only guest tier: no organization, member or invitation mutations. */
    viewer: householdAccessControl.newRole({
        organization: [],
        member: [],
        invitation: [],
        team: [],
        ac: ['read'],
    }),
};
