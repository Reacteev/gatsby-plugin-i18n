/* eslint-disable import/no-named-as-default-member */
import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import { getI18nInstance } from './i18n';
import { withDefaults } from '../utils/default-options';
import i18n from 'i18next';

const wrapRootElement = ({ element }, pluginOptions) => {
  const { i18nextOptions } = withDefaults(pluginOptions);

  // Ensure i18n global singleton is initialized with base options before
  // any component renders. wrapPageElement will update locale and resources.
  if (!i18n.isInitialized) {
    i18n.init({
      lng: i18nextOptions.fallbackLng || 'en',
      resources: {},
      ...i18nextOptions,
    });
  }

  return <I18nextProvider i18n={getI18nInstance()}>{element}</I18nextProvider>;
};

export { wrapRootElement };
