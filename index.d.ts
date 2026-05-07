declare module 'gatsby-plugin-i18n' {
  export const LocaleContext: React.Context<string>;
  export const LocaleProvider: React.FC<{ pageContext: { locale: string } }>;

  export const MdxLink: (props: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any;
    href: string;
    children: React.ReactNode;
  }) => JSX.Element;

  interface LocalizedLinkProps<TState> extends GatsbyLinkProps<TState> {
    language?: string;
  }
  export const LocalizedLink: React.FC<LocalizedLinkProps>;

  export const HeadI18nProvider: React.FC<{
    locale: string;
    namespaces: string[];
    children: React.ReactNode;
  }>;

  export const useLocalization: () => {
    locale: string;
    defaultLang: string;
    prefixDefault: boolean;
    config: {
      code: string;
      localName: string;
    }[];
    localizedPath: ({
      defaultLang: string,
      prefixDefault: string,
      locale: string,
      path: string,
    }) => string;
  };
}
