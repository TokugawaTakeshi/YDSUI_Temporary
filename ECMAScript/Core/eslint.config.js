const YamatoDaiwaStyleGuides = require("@yamato-daiwa/style_guides/ECMAScript");


module.exports = [

  {
    ignores: [
      "Distributable/"
    ]
  },

  ...YamatoDaiwaStyleGuides,

  {
    languageOptions: {
      parserOptions: {
        project: "tsconfig.eslint.json"
      }
    }
  },

  {

    files: [ "Source/Testing/Testers/**/*.ts" ],

    rules: {

      /* [ Justification ] It is challenging to obey this rule with callback-based API. */
      "max-nested-callbacks": "off",

      /* [ Justification ] Usage of fixed hardcoded data is allowed to tests. */
      "@typescript-eslint/no-magic-numbers": "off",

      /* [ Justification ] Allow writing 5 array elements per row to make the number of elements quick to identify. */
      "@stylistic/array-element-newline": "off"

    }
  }

];
