module.exports = {
  env: {
    browser: false,
    node: true,
  },
  parser: 'babel-eslint',
  plugins: ['prettier'],
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // already defined with prettier:
    'prettier/prettier': ['warn'],
    'no-unused-vars': [1],
    'no-console': ['off'],
    indent: ['off', 2],
    quotes: ['off', 'single'],
    semi: ['off', 'always'],
  },
};
