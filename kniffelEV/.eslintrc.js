module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    "comma-dangle": ["error", "only-multiline"],
    "semi": "off",
    "no-extra-semi": "off",
    "no-multiple-empty-lines": "off",
    "no-multi-spaces": "off",
    "keyword-spacing": "off",
    "quotes": "off",
    "spaced-comment": "off",
    "space-unary-ops": "off",
    "space-before-function-paren": "off",
    "padded-blocks": "off",
    "camelcase": "off",
    "linebreak-style": "off",
    "prefer-template": "off",
    "no-console": "off",
    "no-alert": "off",
    "no-mixed-operators": "off",
    "func-names": "off",
    "no-plusplus": "off",
    "prefer-spread": "off",
    "max-len": "off",
    "no-nested-ternary": "off",
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
