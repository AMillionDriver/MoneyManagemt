module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: ['node_modules/', 'styles/output.css'],
  rules: {
    'no-console': 'off',
    'linebreak-style': 'off',
    'no-alert': 'off',
    'import/extensions': 'off',
  },
};
