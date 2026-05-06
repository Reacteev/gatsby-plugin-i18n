/* eslint-disable react/prop-types */
import * as React from 'react';

const LocaleContext = React.createContext('en');

const LocaleProvider = ({ children, pageContext: { locale = 'en' } }) => (
  <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
);

export { LocaleContext, LocaleProvider };
