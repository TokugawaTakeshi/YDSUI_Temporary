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

      /* [ Justification ] Allow the expressions like `new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("-").join("")`. */
      "@stylistic/newline-per-chained-call": [ "warn", { ignoreChainWithDepth: 3 } ]

    }
  }

];
