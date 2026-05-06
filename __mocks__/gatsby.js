const React = require('react');

const gatsby = jest.requireActual('gatsby');

const StaticQuery = jest.fn();
const useStaticQuery = jest.fn();

module.exports = {
  ...gatsby,
  graphql: jest.fn((strings) => strings.join('')),
  Link: jest.fn(({ to, children, ...rest }) =>
    React.createElement('a', { ...rest, href: to }, children),
  ),
  StaticQuery,
  useStaticQuery,
  navigate: jest.fn(),
};
