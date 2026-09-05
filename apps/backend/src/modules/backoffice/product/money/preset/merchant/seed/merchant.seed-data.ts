import { JarKey } from '@rumbelo/contracts';

type Seed = {
    key: string;
    name: string;
    matchValue: string;
    aliases: string[];
    mcc: string | null;
    jarKey: JarKey;
    categoryTemplateKey: string;
};

const N = JarKey.NECESSITIES;
const P = JarKey.PLAY;

/**
 * Merchant matchbook for inbox rules / future Open Banking (Revolut, etc.).
 * `aliases` cover noisy descriptors; `mcc` is optional ISO 18245.
 */
export const MERCHANT_PRESET_SEED: readonly Seed[] = [
    {
        key: 'ALBERT_HEIJN',
        name: 'Albert Heijn',
        matchValue: 'Albert Heijn',
        aliases: ['Albert Heijn', 'AH ', 'AH.nl', 'AH TO GO', 'AH to go'],
        mcc: '5411',
        jarKey: N,
        categoryTemplateKey: 'GROCERIES',
    },
    {
        key: 'JUMBO',
        name: 'Jumbo',
        matchValue: 'Jumbo',
        aliases: ['Jumbo', 'JUMBO SUPERMARKT'],
        mcc: '5411',
        jarKey: N,
        categoryTemplateKey: 'GROCERIES',
    },
    {
        key: 'LIDL',
        name: 'Lidl',
        matchValue: 'Lidl',
        aliases: ['Lidl', 'LIDL NL'],
        mcc: '5411',
        jarKey: N,
        categoryTemplateKey: 'GROCERIES',
    },
    {
        key: 'PLUS',
        name: 'PLUS',
        matchValue: 'PLUS',
        aliases: ['PLUS supermarket', 'Plus Supermarkt'],
        mcc: '5411',
        jarKey: N,
        categoryTemplateKey: 'GROCERIES',
    },
    {
        key: 'SPOTIFY',
        name: 'Spotify',
        matchValue: 'Spotify',
        aliases: ['Spotify', 'SPOTIFY AB', 'Spotify P', 'SPOTIFY*'],
        mcc: '4899',
        jarKey: P,
        categoryTemplateKey: 'MEDIA',
    },
    {
        key: 'NETFLIX',
        name: 'Netflix',
        matchValue: 'Netflix',
        aliases: ['Netflix', 'NETFLIX.COM', 'NETFLIX COM'],
        mcc: '4899',
        jarKey: P,
        categoryTemplateKey: 'MEDIA',
    },
    {
        key: 'DISNEY_PLUS',
        name: 'Disney+',
        matchValue: 'Disney',
        aliases: ['Disney+', 'Disney Plus', 'DISNEYPLUS', 'Disney*'],
        mcc: '4899',
        jarKey: P,
        categoryTemplateKey: 'MEDIA',
    },
    {
        key: 'NS',
        name: 'NS',
        matchValue: 'NS ',
        aliases: ['NS ', 'NS Groep', 'Nederlandse Spoorwegen', 'OV-chipkaart NS'],
        mcc: '4111',
        jarKey: N,
        categoryTemplateKey: 'TRANSPORT',
    },
    {
        key: 'SHELL',
        name: 'Shell',
        matchValue: 'Shell',
        aliases: ['Shell', 'SHELL NL', 'Shell Station'],
        mcc: '5541',
        jarKey: N,
        categoryTemplateKey: 'TRANSPORT',
    },
    {
        key: 'BP',
        name: 'BP',
        matchValue: 'BP ',
        aliases: ['BP ', 'BP Station', 'BP EXPRESS'],
        mcc: '5541',
        jarKey: N,
        categoryTemplateKey: 'TRANSPORT',
    },
    {
        key: 'BOL',
        name: 'bol.com',
        matchValue: 'bol.com',
        aliases: ['bol.com', 'BOL.COM', 'Bol Com', 'BOL COM BV'],
        mcc: '5399',
        jarKey: P,
        categoryTemplateKey: 'HOBBIES',
    },
    {
        key: 'AMAZON',
        name: 'Amazon',
        matchValue: 'Amazon',
        aliases: ['Amazon', 'AMAZON EU', 'AMZN', 'Amazon.nl', 'AMAZON PAYMENTS'],
        mcc: '5399',
        jarKey: P,
        categoryTemplateKey: 'HOBBIES',
    },
    {
        key: 'UBER',
        name: 'Uber',
        matchValue: 'Uber',
        aliases: ['Uber', 'UBER BV', 'UBER *TRIP', 'UBER *EATS'],
        mcc: '4121',
        jarKey: P,
        categoryTemplateKey: 'EATING_OUT',
    },
    {
        key: 'THUISBEZORGD',
        name: 'Thuisbezorgd',
        matchValue: 'Thuisbezorgd',
        aliases: ['Thuisbezorgd', 'Just Eat', 'JE*THUISBEZORGD'],
        mcc: '5812',
        jarKey: P,
        categoryTemplateKey: 'EATING_OUT',
    },
    {
        key: 'VODAFONE',
        name: 'Vodafone',
        matchValue: 'Vodafone',
        aliases: ['Vodafone', 'VODAFONE NL', 'VodafoneZiggo'],
        mcc: '4814',
        jarKey: N,
        categoryTemplateKey: 'SUBSCRIPTIONS',
    },
    {
        key: 'KPN',
        name: 'KPN',
        matchValue: 'KPN',
        aliases: ['KPN', 'KPN BV', 'KPN Mobiel'],
        mcc: '4814',
        jarKey: N,
        categoryTemplateKey: 'SUBSCRIPTIONS',
    },
];
