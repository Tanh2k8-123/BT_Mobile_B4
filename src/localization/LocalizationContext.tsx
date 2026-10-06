import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Language, TranslationKey } from '../types';
import { translations } from './translations';

const LANGUAGE_KEY = '@student-manager/language';
type LocalizationValue = {
  language: Language;
  ready: boolean;
  setLanguage: (language: Language | null) => Promise<void>;
  t: (key: TranslationKey) => string;
};

const LocalizationContext = createContext<LocalizationValue | null>(null);

const deviceLanguage = (): Language => {
  const locale = getLocales()[0]?.languageCode?.toLowerCase();
  return locale === 'vi' ? 'vi' : 'en';
};

export function LocalizationProvider({ children }: React.PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>(deviceLanguage);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY)
      .then((value) => {
        if (value === 'en' || value === 'vi') setLanguageState(value);
      })
      .finally(() => setReady(true));
  }, []);

  const setLanguage = useCallback(async (nextLanguage: Language | null) => {
    if (nextLanguage === null) {
      await AsyncStorage.removeItem(LANGUAGE_KEY);
      setLanguageState(deviceLanguage());
      return;
    }
    await AsyncStorage.setItem(LANGUAGE_KEY, nextLanguage);
    setLanguageState(nextLanguage);
  }, []);

  const value = useMemo<LocalizationValue>(() => ({
    language,
    ready,
    setLanguage,
    t: (key) => translations[language][key],
  }), [language, ready, setLanguage]);

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useLocalization() {
  const value = useContext(LocalizationContext);
  if (!value) throw new Error('useLocalization must be used inside LocalizationProvider.');
  return value;
}
