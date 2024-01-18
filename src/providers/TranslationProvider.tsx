import React from 'react';
import { IntlProvider } from 'react-intl';

import enMessages from '../translations/en.json';
import { SupportedLanguage } from '../types/translations.types';

const messagesMap = {
  [SupportedLanguage.en]: enMessages,
};

const TranslationProvider: React.FC = ({ children }) => {
  return (
    <IntlProvider locale={SupportedLanguage.en} messages={messagesMap[SupportedLanguage.en]}>
      {children}
    </IntlProvider>
  );
};

export default TranslationProvider;
