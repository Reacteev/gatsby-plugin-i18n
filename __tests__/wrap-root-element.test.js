import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { wrapRootElement } from '../src/wrap-root-element';

const TestConsumer = () => {
  const { i18n } = useTranslation();
  return <span data-testid="lang">{i18n.language || 'none'}</span>;
};

describe('wrapRootElement', () => {
  it('wraps children with I18nextProvider', () => {
    expect.hasAssertions();
    const element = <TestConsumer />;
    const result = wrapRootElement({ element }, { i18nextOptions: { fallbackLng: 'fr' } });
    render(result);
    expect(screen.getByTestId('lang')).toHaveTextContent('fr');
  });

  it('initializes i18n only once across multiple calls', () => {
    expect.hasAssertions();
    const element = <TestConsumer />;
    const opts = { i18nextOptions: { fallbackLng: 'fr' } };

    const result1 = wrapRootElement({ element }, opts);
    const { unmount } = render(result1);
    expect(screen.getByTestId('lang')).toHaveTextContent('fr');
    unmount();

    const result2 = wrapRootElement({ element }, opts);
    render(result2);
    expect(screen.getByTestId('lang')).toHaveTextContent('fr');
  });
});
