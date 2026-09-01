import { messages, type MessageLocale } from './messages.js';

export { messages, type MessageLocale };

export type AppLocale = MessageLocale;
export const DEFAULT_LOCALE: AppLocale = 'nl';

type NestedKeyOf<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

export type MessageKey = NestedKeyOf<(typeof messages)['nl']>;

export function t(key: MessageKey, locale: AppLocale = DEFAULT_LOCALE): string {
  const parts = key.split('.');
  let node: unknown = messages[locale];
  for (const part of parts) {
    if (node && typeof node === 'object' && part in node) {
      node = (node as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  return typeof node === 'string' ? node : key;
}
