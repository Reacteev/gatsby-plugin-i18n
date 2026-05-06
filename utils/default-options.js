const defaultLang = 'en';

function withDefaults(themeOptions) {
  const i18nextUserOptions = themeOptions.i18nextOptions || {};

  return {
    ...themeOptions,
    configPath: themeOptions.configPath,
    defaultLang: themeOptions.defaultLang || defaultLang,
    prefixDefault: themeOptions.prefixDefault ?? false,
    locales: themeOptions.locales || null,
    i18nextOptions: {
      defaultNS: 'translation',
      ns: ['translation'],
      fallbackLng: defaultLang,
      initImmediate: false,
      ...i18nextUserOptions,
      interpolation: {
        escapeValue: false,
        ...(i18nextUserOptions.interpolation || {}),
      },
    },
  };
}

exports.withDefaults = withDefaults;
exports.defaultLang = defaultLang;
