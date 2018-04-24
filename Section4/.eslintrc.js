module.exports = {
  env: {
    browser: true,
  },
  parser: 'babel-eslint',
  plugins: ['react', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
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
