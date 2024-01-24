import type en from '../translations/en.json';

export enum SupportedLanguage {
  en = 'en',
}

export type TextValues = Record<string, string | number | undefined>;

export type TranslationKeys = keyof typeof en;
