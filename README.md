# headless-dashboard

## Development Setup

1. Setup environment dependencies

```bash
# nuxtjs prefers node lts version
$ brew install node@14

# yarn as preferred package manager
$ npm install --global yarn
```

2. Setup VSCode with following plugins

- vetur (must have)
- auto close tag
- auto rename tag
- i18n Ally
- json5 syntax
- vue snippets

3. Setup Chrome browser plugins

- Vue Devtools

## Build Setup

```bash
# install dependencies
$ yarn install

# install production only dependencies
$ yarn install --production

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate

# check node_modules size
$ ls node_modules | wc -l && du -sh node_modules
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Production Checklist
- firebase auth
  - enable email/password sign-in methods
  - change password reset email template base url from `localhost` to `{{ PROD_URL }}`
  - change verify email template base url from `localhost` to `{{ PROD_URL }}`

## Commit Guide

Use conventional commits standard

```code
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]

---

e.g. chore: first commit
e.g. feat(0.1.0): add authentication module
e.g. fix(0.1.1): fix unable login bug due to uppercase
e.g. docs: add commit guide on readme
```

For detailed explanation on how things work, check out the [documentation](https://www.conventionalcommits.org/en/v1.0.0/#specification) or [cheatsheet](https://cheatography.com/albelop/cheat-sheets/conventional-commits/) for quick access.

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).

### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).
