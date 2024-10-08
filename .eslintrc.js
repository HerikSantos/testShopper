module.exports = {
    "env": {
        "es2021": true,
        "browser": true,
        "jest": true
    },
    "extends": [
        "standard-with-typescript",
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "plugin:prettier/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "eslint-plugin-import-helpers",
        "prettier"
    ],
    "rules": {
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "prettier/prettier": "error",
        "camelcase": "off",
"import/no-unresolved": "error",
"@typescript-eslint/naming-convention": [
  "error",
  {
    "selector": "interface",
    "format": ["PascalCase"],
    "custom": {
      "regex": "^I[A-Z]",
      "match": true
    }
  }
],
"class-methods-use-this": "off",
"import/prefer-default-export": "off",
"no-shadow": "off",
"no-console": "off",
"no-useless-constructor": "off",
"no-empty-function": "off",
"lines-between-class-members": "off",
"import/extensions": [
  "error",
  "ignorePackages",
  {
    "ts": "never"
  }
],
"import-helpers/order-imports": [
  "warn",
  {
    "newlinesBetween": "always",
    "groups": ["module", "/^@shared/", ["parent", "sibling", "index"]],
    "alphabetize": { "order": "asc", "ignoreCase": true }
  }
],
"import/no-extraneous-dependencies": [
  "error",
  { "devDependencies": ["**/*.spec.js"] }
]
    },

    "settings": {
        "import/resolver": {
          "typescript": {}
        }
      }
}
