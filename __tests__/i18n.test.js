describe('i18n', () => {
  let i18nModule;

  // eslint-disable-next-line jest/no-hooks
  beforeEach(() => {
    jest.resetModules();
    i18nModule = require('../src/i18n');
  });

  describe('getI18nInstance', () => {
    it('returns the i18next singleton', () => {
      expect.hasAssertions();
      const instance = i18nModule.getI18nInstance();
      expect(instance).toBeDefined();
      expect(typeof instance.t).toBe('function');
    });
  });

  describe('initI18n', () => {
    it('initializes i18next with locale and resources', () => {
      expect.hasAssertions();
      const resources = {
        fr: { translation: { hello: 'Bonjour' } },
      };
      const result = i18nModule.initI18n('fr', resources, {
        initImmediate: false,
        interpolation: { escapeValue: false },
      });
      expect(result.language).toBe('fr');
      expect(result.t('hello')).toBe('Bonjour');
    });

    it('changes language on subsequent calls', () => {
      expect.hasAssertions();
      const frResources = { fr: { translation: { hello: 'Bonjour' } } };
      const enResources = { en: { translation: { hello: 'Hello' } } };

      i18nModule.initI18n('fr', frResources, {
        initImmediate: false,
        interpolation: { escapeValue: false },
      });

      i18nModule.initI18n('en', enResources, {
        initImmediate: false,
        interpolation: { escapeValue: false },
      });

      const instance = i18nModule.getI18nInstance();
      expect(instance.language).toBe('en');
      expect(instance.t('hello')).toBe('Hello');
    });

    it('re-initializes with new resources on each call', () => {
      expect.hasAssertions();
      const resources1 = { fr: { ns1: { key1: 'val1' } } };
      const resources2 = { fr: { ns2: { key2: 'val2' } } };

      i18nModule.initI18n('fr', resources1, {
        initImmediate: false,
        ns: ['ns1'],
        defaultNS: 'ns1',
        interpolation: { escapeValue: false },
      });

      const instance = i18nModule.getI18nInstance();
      expect(instance.t('key1', { ns: 'ns1' })).toBe('val1');

      // Second init replaces resources (matches original theme behavior)
      i18nModule.initI18n('fr', resources2, {
        initImmediate: false,
        ns: ['ns2'],
        defaultNS: 'ns2',
        interpolation: { escapeValue: false },
      });

      expect(instance.t('key2', { ns: 'ns2' })).toBe('val2');
    });
  });

  describe('loadResources', () => {
    it('loads JSON files for all namespaces', () => {
      expect.hasAssertions();
      const localesDir = require('path').resolve(__dirname, '../../../i18n/react-i18next');
      const resources = i18nModule.loadResources(localesDir, 'fr', ['header']);
      expect(resources.fr).toBeDefined();
      expect(resources.fr.header).toBeDefined();
      expect(typeof resources.fr.header).toBe('object');
    });

    it('skips missing namespace files without throwing', () => {
      expect.hasAssertions();
      const localesDir = require('path').resolve(__dirname, '../../../i18n/react-i18next');
      const resources = i18nModule.loadResources(localesDir, 'fr', ['nonexistent-ns']);
      expect(resources.fr).toBeUndefined();
    });
  });
});
