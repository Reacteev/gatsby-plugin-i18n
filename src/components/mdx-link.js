/* eslint-disable react/prop-types */
import * as React from 'react';
import { LocalizedLink } from './localized-link';

const defined = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.zip',
  '.rar',
  '.tar',
  '.gz',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.webp',
  '.mp3',
  '.mp4',
  '.avi',
  '.mov',
  '.wmv',
];

function isHash(str) {
  return /^#/.test(str);
}

function isExternal(str) {
  return /^https?:\/\//.test(str);
}

function isFile(str) {
  return defined.some((ext) => str.endsWith(ext));
}

const MdxLink = ({ href, children, ...props }) => {
  if (isHash(href)) {
    return (
      <a {...props} href={href}>
        {children}
      </a>
    );
  }

  if (isExternal(href)) {
    return (
      <a {...props} href={href}>
        {children}
      </a>
    );
  }

  if (isFile(href)) {
    return (
      <a {...props} href={href}>
        {children}
      </a>
    );
  }

  return (
    <LocalizedLink {...props} to={href}>
      {children}
    </LocalizedLink>
  );
};

export { MdxLink };
