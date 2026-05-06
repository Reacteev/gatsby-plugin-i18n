/* eslint-disable react/prop-types */
import * as React from 'react';
import { Link } from 'gatsby';
import { useLocalization } from '../hooks/use-localization';

const LocalizedLink = ({ to, language, ...props }) => {
  const { locale, defaultLang, prefixDefault, localizedPath } = useLocalization();

  const linkLocale = language || locale;

  return (
    <Link
      {...props}
      to={localizedPath({
        defaultLang,
        prefixDefault,
        locale: linkLocale,
        path: to,
      })}
    />
  );
};

export { LocalizedLink };
