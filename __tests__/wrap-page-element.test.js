import * as React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the GATSBY_PLUGIN_I18N_LOCALES global used by loadResources
const path = require('path');
global.GATSBY_PLUGIN_I18N_LOCALES = path.resolve(__dirname, '../../../i18n/react-i18next');

const { LocaleContext } = require('../src/context');
const { wrapPageElement } = require('../src/wrap-page-element');

const LocaleConsumer = () => {
  const locale = React.useContext(LocaleContext);
  return <span data-testid="locale">{locale}</span>;
};

const pluginOptions = {
  i18nextOptions: {
    ns: ['header'],
    fallbackLng: 'fr',
    initImmediate: false,
    interpolation: { escapeValue: false },
  },
};

describe('wrapPageElement', () => {
  it('wraps children with LocaleProvider from pageContext', () => {
    expect.hasAssertions();
    const element = <LocaleConsumer />;
    const props = { pageContext: { locale: 'fr' } };

    const result = wrapPageElement({ element, props }, pluginOptions);
    render(result);
    expect(screen.getByTestId('locale')).toHaveTextContent('fr');
  });

  it('initializes i18n with resources for the locale', () => {
    expect.hasAssertions();
    const i18n = require('i18next');
    const element = <LocaleConsumer />;
    const props = { pageContext: { locale: 'en' } };

    wrapPageElement({ element, props }, pluginOptions);

    expect(i18n.language).toBe('en');
    expect(i18n.hasResourceBundle('en', 'header')).toBe(true);
  });

  it('handles missing locale in pageContext gracefully', () => {
    expect.hasAssertions();
    const element = <LocaleConsumer />;
    const props = { pageContext: {} };

    const result = wrapPageElement({ element, props }, pluginOptions);
    render(result);
    expect(screen.getByTestId('locale')).toHaveTextContent('en');
  });
});
