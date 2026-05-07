/* eslint-disable react/prop-types */
/* global GATSBY_PLUGIN_I18N_LOCALES */
import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import { useStaticQuery, graphql } from 'gatsby';
import { getI18nInstance, loadResources } from '../i18n';

const HeadI18nProvider = ({ locale, namespaces, children }) => {
  const { themeI18N } = useStaticQuery(graphql`
    query HeadI18nQuery {
      themeI18N {
        defaultLang
      }
    }
  `);

  const globalI18n = getI18nInstance();

  const i18n = React.useMemo(() => {
    const instance = globalI18n.cloneInstance({
      lng: locale,
      fallbackLng: themeI18N.defaultLang,
      initImmediate: false,
      interpolation: { escapeValue: false },
    });

    const resources = loadResources(GATSBY_PLUGIN_I18N_LOCALES, locale, namespaces);

    if (resources[locale]) {
      Object.keys(resources[locale]).forEach((ns) => {
        instance.addResourceBundle(locale, ns, resources[locale][ns], true, true);
      });
    }

    if (!instance.isInitialized) {
      instance.init();
    }

    return instance;
  }, [globalI18n, locale, namespaces, themeI18N.defaultLang]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export { HeadI18nProvider };
