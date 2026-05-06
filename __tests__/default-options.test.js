const { withDefaults } = require('../utils/default-options');

describe('withDefaults', () => {
  it('applies default values when no options provided', () => {
    expect.hasAssertions();
    const result = withDefaults({});
    expect(result.defaultLang).toBe('en');
    expect(result.prefixDefault).toBe(false);
    expect(result.locales).toBeNull();
    expect(result.i18nextOptions.defaultNS).toBe('translation');
    expect(result.i18nextOptions.fallbackLng).toBe('en');
    expect(result.i18nextOptions.initImmediate).toBe(false);
    expect(result.i18nextOptions.interpolation.escapeValue).toBe(false);
  });

  it('preserves user-provided values', () => {
    expect.hasAssertions();
    const result = withDefaults({
      defaultLang: 'fr',
      prefixDefault: true,
      configPath: '/path/to/config.json',
    });
    expect(result.defaultLang).toBe('fr');
    expect(result.prefixDefault).toBe(true);
    expect(result.configPath).toBe('/path/to/config.json');
  });

  it('merges i18nextOptions with defaults', () => {
    expect.hasAssertions();
    const result = withDefaults({
      i18nextOptions: {
        ns: ['header', 'footer'],
        fallbackLng: 'fr',
      },
    });
    expect(result.i18nextOptions.ns).toStrictEqual(['header', 'footer']);
    expect(result.i18nextOptions.fallbackLng).toBe('fr');
    expect(result.i18nextOptions.initImmediate).toBe(false);
    expect(result.i18nextOptions.interpolation.escapeValue).toBe(false);
  });

  it('merges nested interpolation options', () => {
    expect.hasAssertions();
    const result = withDefaults({
      i18nextOptions: {
        interpolation: {
          prefix: '{{',
          suffix: '}}',
        },
      },
    });
    expect(result.i18nextOptions.interpolation.escapeValue).toBe(false);
    expect(result.i18nextOptions.interpolation.prefix).toBe('{{');
    expect(result.i18nextOptions.interpolation.suffix).toBe('}}');
  });
});
