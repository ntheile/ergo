module.exports = {
  extends: 'erb/typescript',
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    "import/no-default-export": 0,
    "@typescript-eslint/no-empty-interface": 0,
    "import-order-alphabetical/order": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/ban-ts-ignore": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/ban-types": 0,
    "no-empty": 0,
    "@typescript-eslint/no-empty-function": 0,
    "no-case-declarations": 0,
    "default-case": 0,
    "@typescript-eslint/interface-name-prefix": 0,
    "@typescript-eslint/no-namespace": 0,
    "@typescript-eslint/no-inferrable-types": 0,
    "react/display-name": 0,
    "import/no-unresolved": 0 ,
    "prefer-const": 0,
    "prettier/prettier": "error",
    "react/button-has-type" :0,
    "jsx-a11y/click-events-have-key-events": 0,
    "eslint-disable-next-line": 0,
    "no-alert": 0
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./configs/webpack.config.eslint.js')
      }
    }
  }
};
