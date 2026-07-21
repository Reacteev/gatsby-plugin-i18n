const fs = require('fs');
const nodePath = require('path');
const { withDefaults } = require('./utils/default-options');
const { localizedPath, getLanguages, getDefaultLanguage } = require('./src/helpers');

let absoluteLocalesDirectory;

// --- onPreInit: validate localesPath option and resolve path ---
exports.onPreInit = ({ store }, themeOptions) => {
  const localesPath = themeOptions.localesPath || themeOptions.locales;
  if (!localesPath) {
    throw new Error(`Please define the 'localesPath' option of gatsby-plugin-i18n`);
  }
  absoluteLocalesDirectory = nodePath.join(store.getState().program.directory, localesPath);
};

// --- onPreBootstrap: validate config file ---
exports.onPreBootstrap = ({ reporter }, themeOptions) => {
  if (themeOptions.configPath) {
    if (!fs.existsSync(themeOptions.configPath)) {
      reporter.panicOnBuild(
        `[gatsby-plugin-i18n]: Couldn't find the file at ${themeOptions.configPath}`,
      );
    }
    reporter.info(`[gatsby-plugin-i18n]: Config file found at ${themeOptions.configPath}`);
  }
};

// --- createSchemaCustomization: GraphQL types ---
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type ThemeI18n implements Node {
      defaultLang: String
      prefixDefault: Boolean
      configPath: String
      config: [Locale]
    }

    type Locale {
      code: String
      hrefLang: String
      dateFormat: String
      langDir: String
      localName: String
      name: String
    }
  `);
};

// --- sourceNodes: create ThemeI18n config node ---
exports.sourceNodes = ({ actions, createContentDigest, createNodeId }, themeOptions) => {
  const { createNode } = actions;
  const options = withDefaults(themeOptions);
  const config = require(options.configPath);

  const configNode = {
    ...options,
    config,
  };

  createNode({
    ...configNode,
    id: createNodeId('gatsby-plugin-i18n-config'),
    parent: null,
    children: [],
    internal: {
      type: 'ThemeI18n',
      contentDigest: createContentDigest(configNode),
      content: JSON.stringify(configNode),
      description: 'Options for gatsby-plugin-i18n',
    },
  });
};

// --- onCreateNode: add locale/isDefault fields to MDX nodes ---
exports.onCreateNode = ({ node, actions }, themeOptions) => {
  const { createNodeField } = actions;
  const { defaultLang } = withDefaults(themeOptions);

  if (node.internal.type === 'Mdx') {
    // Gatsby 5 / MDX v5: use internal.contentFilePath (fileAbsolutePath was removed)
    const filePath = node.internal.contentFilePath || node.fileAbsolutePath;
    if (!filePath) {
      return;
    }

    const name = nodePath.basename(filePath, '.mdx');

    const isDefault = name === 'index';
    const lang = isDefault ? defaultLang : name.split('.')[1];

    createNodeField({ node, name: 'locale', value: lang });
    createNodeField({ node, name: 'isDefault', value: isDefault });
  }
};

// --- onCreatePage: create locale-prefixed page copies ---
exports.onCreatePage = ({ page, actions }, themeOptions) => {
  const { createPage, deletePage } = actions;
  const { configPath, defaultLang, locales, prefixDefault } = withDefaults(themeOptions);

  // Skip if page already has originalPath (avoids infinite loop from other plugins)
  if (page.context.originalPath) {
    return;
  }

  const originalPath = page.path;

  deletePage(page);

  const configLocales = require(configPath);
  const languages = getLanguages({ locales: configLocales, localeStr: locales });
  const defaultLocale = getDefaultLanguage({ locales: configLocales, defaultLang });

  languages.forEach((locale) => {
    const newPage = {
      ...page,
      path: localizedPath({
        defaultLang,
        prefixDefault,
        locale: locale.code,
        path: originalPath,
      }),
      matchPath: page.matchPath
        ? localizedPath({ defaultLang, prefixDefault, locale: locale.code, path: page.matchPath })
        : page.matchPath,
      context: {
        ...page.context,
        locale: locale.code,
        hrefLang: locale.hrefLang,
        originalPath,
        dateFormat: locale.dateFormat,
      },
    };

    // Localized 404 matchPath
    if (newPage.path.match(/^\/[a-z]{2}\/404\/$/)) {
      newPage.matchPath = `/${locale.code}/*`;
    }

    // When a page provides per-locale MDX bodies (context.localeContent maps a
    // locale to its __contentFilePath), point this locale's page at its own
    // body. Without this, translated pages sharing one slug all render the same
    // (first-built) language's content.
    const localeContent = page.context && page.context.localeContent;
    if (localeContent && localeContent[locale.code] && typeof newPage.component === 'string') {
      const componentPath = newPage.component.split('?')[0];
      newPage.component = `${componentPath}?__contentFilePath=${localeContent[locale.code]}`;
    }

    createPage(newPage);
  });

  // Recreate default 404/dev pages when prefixDefault is set
  const notFoundPages = ['/404/', '/404.html', '/dev-404-page/'];

  if (prefixDefault && notFoundPages.includes(originalPath)) {
    const newPage = {
      ...page,
      context: {
        ...page.context,
        locale: defaultLocale.code,
        hrefLang: defaultLocale.hrefLang,
        originalPath,
        dateFormat: defaultLocale.dateFormat,
      },
    };
    createPage(newPage);
  }
};

// --- onCreateWebpackConfig: inject locales directory path and resolve alias ---
exports.onCreateWebpackConfig = ({ actions, plugins }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        'gatsby-plugin-i18n': nodePath.resolve(__dirname, 'index.js'),
      },
    },
    plugins: [
      plugins.define({
        GATSBY_PLUGIN_I18N_LOCALES: JSON.stringify(absoluteLocalesDirectory),
      }),
    ],
  });
};
