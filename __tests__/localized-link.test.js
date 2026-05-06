import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { useStaticQuery } from 'gatsby';
import { LocaleProvider } from '../src/context';

// Must be imported after mocking gatsby
const { LocalizedLink } = require('../src/components/localized-link');

const mockUseStaticQuery = () => {
  useStaticQuery.mockReturnValue({
    themeI18N: {
      defaultLang: 'fr',
      prefixDefault: true,
      config: [
        { code: 'fr', hrefLang: 'fr', localName: 'Français' },
        { code: 'en', hrefLang: 'en', localName: 'English' },
      ],
    },
  });
};

const renderWithLocale = (ui, locale = 'fr') =>
  render(<LocaleProvider pageContext={{ locale }}>{ui}</LocaleProvider>);

describe('localizedLink', () => {
  // eslint-disable-next-line jest/no-hooks
  beforeEach(mockUseStaticQuery);

  it('renders a link with localized path', () => {
    expect.hasAssertions();
    renderWithLocale(<LocalizedLink to="/about/">About</LocalizedLink>);
    const link = screen.getByText('About');
    expect(link).toHaveAttribute('href', '/fr/about/');
  });

  it('uses override language prop', () => {
    expect.hasAssertions();
    renderWithLocale(
      <LocalizedLink to="/about/" language="en">
        About
      </LocalizedLink>,
    );
    const link = screen.getByText('About');
    expect(link).toHaveAttribute('href', '/en/about/');
  });

  it('passes through additional props', () => {
    expect.hasAssertions();
    renderWithLocale(
      <LocalizedLink to="/about/" className="nav-link" data-testid="link">
        About
      </LocalizedLink>,
    );
    const link = screen.getByTestId('link');
    expect(link).toHaveClass('nav-link');
  });
});
