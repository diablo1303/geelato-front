/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    "sourceType": "module",  // 指定来源的类型，"script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)
    "allowImportExportEverywhere": true  // 不限制eslint对import使用位置
  }
}
