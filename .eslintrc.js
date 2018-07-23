module.exports = {
    "extends": "airbnb-base",
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        }
    },
    "rules": {
        "no-underscore-dangle": 0,
        "no-tabs": 0,
        "new-cap": 0,
        "no-param-reassign": 0,
        "import/no-named-as-default": 0,
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};