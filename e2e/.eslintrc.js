module.exports = {
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:cypress/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'cypress'],
  root: true,
};
