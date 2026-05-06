/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';

export function getI18nInstance() {
  return i18n;
}

export function initI18n(locale, resources, i18nextOptions) {
  // Re-initialize on every call to match the original gatsby-theme-i18n-react-i18next behavior.
  // In Gatsby SSR, each page render needs a fresh init with the correct locale and resources.
  i18n.init({
    lng: locale,
    resources,
    ...i18nextOptions,
  });
  return i18n;
}

export function loadResources(localesDirectory, locale, namespaces) {
  const resources = {};
  namespaces.forEach((name) => {
    try {
      const data = require(`${localesDirectory}/${locale}/${name}.json`);
      resources[locale] = {
        ...resources[locale],
        [name]: data,
      };
    } catch {
      // Namespace file not found for this locale — skip
    }
  });
  return resources;
}
