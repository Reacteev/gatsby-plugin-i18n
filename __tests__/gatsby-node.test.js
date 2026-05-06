const path = require('path');
const gatsbyNode = require('../gatsby-node');

const mockActions = {
  createNodeField: jest.fn(),
  createNode: jest.fn(),
  createTypes: jest.fn(),
  createPage: jest.fn(),
  deletePage: jest.fn(),
  setWebpackConfig: jest.fn(),
};

const mockReporter = {
  info: jest.fn(),
  panicOnBuild: jest.fn(),
};

const rootDir = path.resolve(__dirname, '../../..');

const themeOptions = {
  defaultLang: 'fr',
  prefixDefault: true,
  configPath: path.resolve(rootDir, 'i18n/config.json'),
  localesPath: './i18n/react-i18next',
  i18nextOptions: {
    ns: ['header'],
    fallbackLng: 'fr',
  },
};

// Initialize the locales directory path (normally done by Gatsby lifecycle)
const mockStore = { getState: () => ({ program: { directory: rootDir } }) };
gatsbyNode.onPreInit({ store: mockStore }, themeOptions);

describe('onPreBootstrap', () => {
  it('reports info when configPath exists', () => {
    expect.hasAssertions();
    gatsbyNode.onPreBootstrap({ reporter: mockReporter }, themeOptions);
    expect(mockReporter.info).toHaveBeenCalledWith(expect.stringContaining('Config file found'));
  });

  it('panics when configPath does not exist', () => {
    expect.hasAssertions();
    gatsbyNode.onPreBootstrap(
      { reporter: mockReporter },
      {
        ...themeOptions,
        configPath: '/nonexistent/path.json',
      },
    );
    expect(mockReporter.panicOnBuild).toHaveBeenCalledWith(
      expect.stringContaining("Couldn't find the file"),
    );
  });
});

describe('createSchemaCustomization', () => {
  it('creates ThemeI18n and Locale types', () => {
    expect.hasAssertions();
    gatsbyNode.createSchemaCustomization({ actions: mockActions });
    expect(mockActions.createTypes).toHaveBeenCalledWith(expect.stringContaining('ThemeI18n'));
    expect(mockActions.createTypes).toHaveBeenCalledWith(expect.stringContaining('Locale'));
  });
});

describe('sourceNodes', () => {
  it('creates a ThemeI18n node', () => {
    expect.hasAssertions();
    const createNodeId = jest.fn(() => 'test-id');
    const createContentDigest = jest.fn(() => 'test-digest');

    gatsbyNode.sourceNodes(
      { actions: mockActions, createNodeId, createContentDigest },
      themeOptions,
    );

    expect(mockActions.createNode).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'test-id',
        internal: expect.objectContaining({
          type: 'ThemeI18n',
        }),
      }),
    );
  });
});

describe('onCreateNode', () => {
  // eslint-disable-next-line jest/no-hooks
  beforeEach(() => {
    mockActions.createNodeField.mockClear();
  });

  it('adds locale and isDefault fields to MDX nodes', () => {
    expect.hasAssertions();
    const node = {
      internal: {
        type: 'Mdx',
        contentFilePath: '/path/to/index.fr.mdx',
      },
    };
    gatsbyNode.onCreateNode({ node, actions: mockActions }, themeOptions);
    expect(mockActions.createNodeField).toHaveBeenCalledWith({
      node,
      name: 'locale',
      value: 'fr',
    });
    expect(mockActions.createNodeField).toHaveBeenCalledWith({
      node,
      name: 'isDefault',
      value: false,
    });
  });

  it('sets isDefault true for index files', () => {
    expect.hasAssertions();
    const node = {
      internal: {
        type: 'Mdx',
        contentFilePath: '/path/to/index.mdx',
      },
    };
    gatsbyNode.onCreateNode({ node, actions: mockActions }, themeOptions);
    expect(mockActions.createNodeField).toHaveBeenCalledWith({
      node,
      name: 'locale',
      value: 'fr', // defaultLang
    });
    expect(mockActions.createNodeField).toHaveBeenCalledWith({
      node,
      name: 'isDefault',
      value: true,
    });
  });

  it('extracts locale from filename like index.en.mdx', () => {
    expect.hasAssertions();
    const node = {
      internal: {
        type: 'Mdx',
        contentFilePath: '/path/to/index.en.mdx',
      },
    };
    gatsbyNode.onCreateNode({ node, actions: mockActions }, themeOptions);
    expect(mockActions.createNodeField).toHaveBeenCalledWith({
      node,
      name: 'locale',
      value: 'en',
    });
  });

  it('ignores non-MDX nodes', () => {
    expect.hasAssertions();
    const node = {
      internal: { type: 'File' },
    };
    gatsbyNode.onCreateNode({ node, actions: mockActions }, themeOptions);
    expect(mockActions.createNodeField).not.toHaveBeenCalled();
  });
});

describe('onCreatePage', () => {
  const localActions = {
    createPage: jest.fn(),
    deletePage: jest.fn(),
  };

  // eslint-disable-next-line jest/no-hooks
  beforeEach(() => {
    localActions.createPage.mockClear();
    localActions.deletePage.mockClear();
  });

  it('skips pages that already have originalPath', () => {
    expect.hasAssertions();
    const page = { path: '/about/', context: { originalPath: '/about/' } };
    gatsbyNode.onCreatePage({ page, actions: localActions }, themeOptions);
    expect(localActions.deletePage).not.toHaveBeenCalled();
    expect(localActions.createPage).not.toHaveBeenCalled();
  });

  it('creates localized page copies', () => {
    expect.hasAssertions();
    const page = { path: '/about/', context: {} };
    gatsbyNode.onCreatePage({ page, actions: localActions }, themeOptions);
    expect(localActions.deletePage).toHaveBeenCalledWith(page);
    expect(localActions.createPage).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/fr/about/',
        context: expect.objectContaining({ locale: 'fr' }),
      }),
    );
    expect(localActions.createPage).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/en/about/',
        context: expect.objectContaining({ locale: 'en' }),
      }),
    );
  });

  it('sets correct pageContext', () => {
    expect.hasAssertions();
    const page = { path: '/about/', context: {} };
    gatsbyNode.onCreatePage({ page, actions: localActions }, themeOptions);
    const frCall = localActions.createPage.mock.calls.find(([p]) => p.context.locale === 'fr');
    expect(frCall[0].context).toStrictEqual(
      expect.objectContaining({
        locale: 'fr',
        originalPath: '/about/',
      }),
    );
  });
});

describe('onCreateWebpackConfig', () => {
  it('defines the GATSBY_PLUGIN_I18N_LOCALES global', () => {
    expect.hasAssertions();
    const plugins = { define: jest.fn((obj) => obj) };
    gatsbyNode.onCreateWebpackConfig({ actions: mockActions, plugins });
    expect(plugins.define).toHaveBeenCalledWith(
      expect.objectContaining({
        GATSBY_PLUGIN_I18N_LOCALES: expect.any(String),
      }),
    );
  });
});
