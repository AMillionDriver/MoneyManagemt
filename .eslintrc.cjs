module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: [
    'node_modules/',
    'styles/output.css',
  ],
  rules: {
    'no-console': 'off',
    'linebreak-style': 'off',
  },
};