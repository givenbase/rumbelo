import { JarKey } from '@rumbelo/contracts';

/** English category spine — single source of truth for preset categoryTemplateKey. */
export const CATEGORY_TEMPLATE_SEED = [
    // NECESSITIES
    { key: 'HOUSING', name: 'Housing', jarKey: JarKey.NECESSITIES },
    { key: 'GROCERIES', name: 'Groceries', jarKey: JarKey.NECESSITIES },
    { key: 'UTILITIES', name: 'Utilities', jarKey: JarKey.NECESSITIES },
    { key: 'INSURANCE', name: 'Insurance', jarKey: JarKey.NECESSITIES },
    { key: 'TRANSPORT', name: 'Transport', jarKey: JarKey.NECESSITIES },
    { key: 'SUBSCRIPTIONS', name: 'Subscriptions', jarKey: JarKey.NECESSITIES },
    { key: 'TAXES', name: 'Taxes', jarKey: JarKey.NECESSITIES },
    { key: 'FAMILY', name: 'Family', jarKey: JarKey.NECESSITIES },
    { key: 'DEBT_PAYMENTS', name: 'Debt payments', jarKey: JarKey.NECESSITIES },
    { key: 'CARE', name: 'Care', jarKey: JarKey.NECESSITIES },
    { key: 'PETS', name: 'Pets', jarKey: JarKey.NECESSITIES },
    { key: 'BANKING', name: 'Banking', jarKey: JarKey.NECESSITIES },
    // FINANCIAL_FREEDOM
    { key: 'INDEX_FUNDS', name: 'Index funds', jarKey: JarKey.FINANCIAL_FREEDOM },
    { key: 'STOCKS', name: 'Stocks', jarKey: JarKey.FINANCIAL_FREEDOM },
    { key: 'BONDS', name: 'Bonds', jarKey: JarKey.FINANCIAL_FREEDOM },
    { key: 'BUSINESS', name: 'Business', jarKey: JarKey.FINANCIAL_FREEDOM },
    // LONG_TERM_SAVINGS
    { key: 'EMERGENCY_FUND', name: 'Emergency fund', jarKey: JarKey.LONG_TERM_SAVINGS },
    { key: 'BIG_PURCHASES', name: 'Big purchases', jarKey: JarKey.LONG_TERM_SAVINGS },
    { key: 'HOME_DEPOSIT', name: 'Home deposit', jarKey: JarKey.LONG_TERM_SAVINGS },
    // EDUCATION
    { key: 'BOOKS', name: 'Books', jarKey: JarKey.EDUCATION },
    { key: 'COURSES', name: 'Courses', jarKey: JarKey.EDUCATION },
    { key: 'MENTORS', name: 'Mentors', jarKey: JarKey.EDUCATION },
    { key: 'TOOLS', name: 'Tools', jarKey: JarKey.EDUCATION },
    { key: 'TUITION', name: 'Tuition', jarKey: JarKey.EDUCATION },
    // PLAY
    { key: 'EATING_OUT', name: 'Eating out', jarKey: JarKey.PLAY },
    { key: 'HOBBIES', name: 'Hobbies', jarKey: JarKey.PLAY },
    { key: 'MEDIA', name: 'Media', jarKey: JarKey.PLAY },
    { key: 'SPORT', name: 'Sport', jarKey: JarKey.PLAY },
    // GIVE
    { key: 'DONATIONS', name: 'Donations', jarKey: JarKey.GIVE },
    { key: 'GIFTS', name: 'Gifts', jarKey: JarKey.GIVE },
] as const;
