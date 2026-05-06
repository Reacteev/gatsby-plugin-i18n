/* eslint-disable import/no-named-as-default-member */
/* global GATSBY_PLUGIN_I18N_LOCALES */
import * as React from 'react';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { LocaleProvider } from './context';
import { withDefaults } from '../utils/default-options';

const wrapPageElement = ({ element, props }, pluginOptions) => {
  const { i18nextOptions } = withDefaults(pluginOptions);
  const locale = props.pageContext.locale;

  let resources = {};

  if (locale) {
    i18nextOptions.ns.forEach((name) => {
      try {
        const data = require(`${GATSBY_PLUGIN_I18N_LOCALES}/${locale}/${name}.json`);
        resources = {
          ...resources,
          [locale]: {
            ...resources[locale],
            [name]: data,
          },
        };
      } catch {
        // Namespace file not found — skip
      }
    });
  }

  const i18nConfig = {
    lng: locale,
    resources,
    ...i18nextOptions,
  };

  i18n.init(i18nConfig);

  return (
    <I18nextProvider i18n={i18n}>
      <LocaleProvider pageContext={props.pageContext}>{element}</LocaleProvider>
    </I18nextProvider>
  );
};

export { wrapPageElement };
