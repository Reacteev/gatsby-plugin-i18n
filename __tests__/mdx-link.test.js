import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { useStaticQuery } from 'gatsby';
import { LocaleProvider } from '../src/context';

const { MdxLink } = require('../src/components/mdx-link');

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

describe('mdxLink', () => {
  // eslint-disable-next-line jest/no-hooks
  beforeEach(mockUseStaticQuery);

  it('renders hash links as plain <a>', () => {
    expect.hasAssertions();
    renderWithLocale(<MdxLink href="#section">Jump</MdxLink>);
    const link = screen.getByText('Jump');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '#section');
  });

  it('renders external links as plain <a>', () => {
    expect.hasAssertions();
    renderWithLocale(<MdxLink href="https://example.com">External</MdxLink>);
    const link = screen.getByText('External');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders file links as plain <a>', () => {
    expect.hasAssertions();
    renderWithLocale(<MdxLink href="/files/doc.pdf">Download</MdxLink>);
    const link = screen.getByText('Download');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/files/doc.pdf');
  });

  it('renders internal links as LocalizedLink', () => {
    expect.hasAssertions();
    renderWithLocale(<MdxLink href="/about/">About</MdxLink>);
    const link = screen.getByText('About');
    expect(link).toHaveAttribute('href', '/fr/about/');
  });

  it('handles image extensions as file links', () => {
    expect.hasAssertions();
    renderWithLocale(<MdxLink href="/img/photo.jpg">Photo</MdxLink>);
    const link = screen.getByText('Photo');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/img/photo.jpg');
  });
});
