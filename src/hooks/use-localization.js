import { useContext } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { LocaleContext } from '../context';
import { localizedPath } from '../helpers';

const useLocalization = () => {
  const locale = useContext(LocaleContext);
  const {
    themeI18N: { defaultLang, prefixDefault, config },
  } = useStaticQuery(graphql`
    query {
      themeI18N {
        defaultLang
        prefixDefault
        config {
          code
          hrefLang
          dateFormat
          langDir
          localName
          name
        }
      }
    }
  `);

  return {
    locale,
    defaultLang,
    prefixDefault,
    config,
    localizedPath,
  };
};

export { useLocalization };
