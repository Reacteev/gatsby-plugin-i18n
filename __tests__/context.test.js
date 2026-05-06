import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { LocaleContext, LocaleProvider } from '../src/context';

describe('localeContext', () => {
  it('has default value of "en"', () => {
    expect.hasAssertions();
    const Consumer = () => {
      const locale = React.useContext(LocaleContext);
      return <span data-testid="locale">{locale}</span>;
    };
    render(<Consumer />);
    expect(screen.getByTestId('locale')).toHaveTextContent('en');
  });
});

describe('localeProvider', () => {
  it('provides locale from pageContext', () => {
    expect.hasAssertions();
    const Consumer = () => {
      const locale = React.useContext(LocaleContext);
      return <span data-testid="locale">{locale}</span>;
    };
    render(
      <LocaleProvider pageContext={{ locale: 'fr' }}>
        <Consumer />
      </LocaleProvider>,
    );
    expect(screen.getByTestId('locale')).toHaveTextContent('fr');
  });

  it('falls back to "en" when locale is missing from pageContext', () => {
    expect.hasAssertions();
    const Consumer = () => {
      const locale = React.useContext(LocaleContext);
      return <span data-testid="locale">{locale}</span>;
    };
    render(
      <LocaleProvider pageContext={{}}>
        <Consumer />
      </LocaleProvider>,
    );
    expect(screen.getByTestId('locale')).toHaveTextContent('en');
  });
});
