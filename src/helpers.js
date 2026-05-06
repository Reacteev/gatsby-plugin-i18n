function isDefaultLang(locale, defaultLang) {
  return locale === defaultLang;
}

function localizedPath({ defaultLang, prefixDefault, locale, path }) {
  if (isDefaultLang(locale, defaultLang) && !prefixDefault) {
    return path;
  }

  const [, base] = path.split('/');

  // Check if the path already starts with a locale prefix
  if (base === locale) {
    return path;
  }

  return `/${locale}${path}`;
}

function getLanguages({ locales, localeStr }) {
  if (localeStr) {
    const defined = localeStr.split(' ');
    return locales.filter((locale) => defined.includes(locale.code));
  }
  return locales;
}

function getDefaultLanguage({ locales, defaultLang }) {
  return locales.find((locale) => locale.code === defaultLang);
}

module.exports = { isDefaultLang, localizedPath, getLanguages, getDefaultLanguage };
