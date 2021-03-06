# eslint-plugin-ecmalist

ESlint plugin meant to replace transpilation (like babel). Adds linting for
`ecmascript` features allowed from your `browserslist` configuration. If your library
is for the browser too, use also `eslint-plugin-compat`, as shown below.

## Installation

Use your favorite package manager (mine is pnpm):

`pnpm add -D eslint eslint-plugin-ecmalist`

If in the browser, for browser API, add also:

`pnpm add -D eslint-plugin-compat`

## Usage

Your `.browserslistrc` file:

```
defaults
maintained node versions
not IE 11
```

Your `.eslintrc.*` file:

```json
{
    "extends": ["plugin:ecmalist/recommended"]
}
```

Lets say your browserslist doesn't support `Object.assign()`, but you have polyfill.
In that case add to the config:

```json
{
    "rules": {
        "ecmalist/no-object-assign": "off"
    }
}
```

If you are developing for browsers add to the config `eslint-plugin-compat`:

```json
{
    "extends": ["plugin:ecmalist/recommended", "plugin:compat/recommended"]
}
```

For using aggressive mode from `eslint-plugin-es`, add to the config:

```json
{
    "settings": { "es": { "aggressive": true } }
}
```

## My Thanks

This library was made possible by using the following:

-   [eslint-plugin-es](https://github.com/mysticatea/eslint-plugin-es)
-   [@mdn/browser-compat-data](https://github.com/mdn/browser-compat-data)
-   [browserslist](https://github.com/browserslist/browserslist)

Shoutout also to:

-   [eslint-plugin-compat](https://github.com/amilajack/eslint-plugin-compat)
