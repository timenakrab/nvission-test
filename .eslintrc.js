module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    es6: true,
    'jest/globals': true,
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['prettier', 'react', 'jest', 'simple-import-sort'],
  globals: {
    document: 'readonly',
    window: 'readonly',
    process: 'readonly',
    fetch: 'readonly',
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'import/prefer-default-export': [0],
    'class-methods-use-this': 0,
    'jsx-a11y/label-has-for': 0,
    'simple-import-sort/sort': 'error',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true,
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
      extends: [
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:eslint-comments/recommended',
        'prettier',
        'prettier/@typescript-eslint',
      ],
      plugins: ['prettier', '@typescript-eslint'],
      rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'import/no-mutable-exports': 0,
        'no-labels': 0,
        'no-restricted-syntax': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        'react/jsx-one-expression-per-line': 0,
        '@typescript-eslint/no-unused-vars': ['error'],
        'react/jsx-props-no-spreading': 'off',
      },
    },
  ],
};
