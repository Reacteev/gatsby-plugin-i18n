const {
  localizedPath,
  getLanguages,
  getDefaultLanguage,
  isDefaultLang,
} = require('../src/helpers');

describe('isDefaultLang', () => {
  it('returns true when locale matches default', () => {
    expect.hasAssertions();
    expect(isDefaultLang('fr', 'fr')).toBe(true);
  });
  it('returns false when locale differs', () => {
    expect.hasAssertions();
    expect(isDefaultLang('en', 'fr')).toBe(false);
  });
});

describe('localizedPath', () => {
  const aboutPath = '/about/';
  const enAboutPath = '/en/about/';

  it('returns path unchanged for default lang when prefixDefault is false', () => {
    expect.hasAssertions();
    expect(
      localizedPath({ defaultLang: 'fr', prefixDefault: false, locale: 'fr', path: aboutPath }),
    ).toBe(aboutPath);
  });
  it('prefixes path for non-default lang', () => {
    expect.hasAssertions();
    expect(
      localizedPath({ defaultLang: 'fr', prefixDefault: false, locale: 'en', path: aboutPath }),
    ).toBe(enAboutPath);
  });
  it('prefixes path for default lang when prefixDefault is true', () => {
    expect.hasAssertions();
    expect(
      localizedPath({ defaultLang: 'fr', prefixDefault: true, locale: 'fr', path: aboutPath }),
    ).toBe('/fr/about/');
  });
  it('does not double-prefix when path already starts with locale', () => {
    expect.hasAssertions();
    expect(
      localizedPath({ defaultLang: 'fr', prefixDefault: true, locale: 'en', path: enAboutPath }),
    ).toBe(enAboutPath);
  });
  it('handles root path', () => {
    expect.hasAssertions();
    expect(localizedPath({ defaultLang: 'fr', prefixDefault: true, locale: 'en', path: '/' })).toBe(
      '/en/',
    );
  });
});

describe('getLanguages', () => {
  const locales = [
    { code: 'fr', name: 'French' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'German' },
  ];

  it('returns all locales when localeStr is undefined', () => {
    expect.hasAssertions();
    expect(getLanguages({ locales })).toStrictEqual(locales);
  });
  it('filters locales by space-separated string', () => {
    expect.hasAssertions();
    expect(getLanguages({ locales, localeStr: 'fr en' })).toStrictEqual([
      { code: 'fr', name: 'French' },
      { code: 'en', name: 'English' },
    ]);
  });
  it('returns empty array for non-matching localeStr', () => {
    expect.hasAssertions();
    expect(getLanguages({ locales, localeStr: 'xx' })).toStrictEqual([]);
  });
});

describe('getDefaultLanguage', () => {
  const locales = [
    { code: 'fr', name: 'French' },
    { code: 'en', name: 'English' },
  ];

  it('returns locale matching defaultLang', () => {
    expect.hasAssertions();
    expect(getDefaultLanguage({ locales, defaultLang: 'fr' })).toStrictEqual({
      code: 'fr',
      name: 'French',
    });
  });
  it('returns undefined for non-existent defaultLang', () => {
    expect.hasAssertions();
    expect(getDefaultLanguage({ locales, defaultLang: 'xx' })).toBeUndefined();
  });
});
