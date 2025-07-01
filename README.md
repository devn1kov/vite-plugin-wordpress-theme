# Vite WordPress Theme Generator
A Vite plugin that packages your app as a WordPress theme to use with the REST API or GraphQL plugin. You can upload the output directly to your wordpress installation in /wp-content/themes and activate your theme from the admin panel

> 🚨 This is an experimental project stil in it's early development

## Why this plugin?
### No separate frontend server needed! 🎯
Unlike traditional setups where you run a separate server for your frontend app, this plugin packages your app directly into a WordPress theme.

### ✨ Key Benefits:
- Eliminates complexity: No need to manage both a WordPress backend and a frontend server.
- Simplifies deployment: Your Vite app becomes a standalone WordPress theme, ready to install.
- Reduces overhead: Skip the hassle of running two separate environments (e.g., Docker containers for WP + Node for frontend).

## What it does
- Generates `functions.php` file to enqueue `.css` and `.js` bundles produced by vite
- Creates wordpress theme files (index.php, header.php, footer.php and style.css)
- Applied only on build

## Usage example
### Install
```bash
yarn add -D vite-plugin-wordpress-theme
```

### Add in your Vite configuration file
```ts
// vite.config.ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import wordpressTheme from "vite-plugin-wordpress-theme";

export default defineConfig({
  plugins: [
    react(),
    wordpressTheme({
      themeSlug: "my-theme",
    }),
  ],
})
```

Will produce the following structure on build (dist directory)
```bash
<outDir>
├── assets
│   ├── **/*.css (bundled css files)
│   ├── **/*.js (bundled js files)
├── footer.php
├── functions.php
├── header.php
├── index.php
└── style.css
```

## Static assets
All the imports of static files (for example images) will be handled by vite as usual, but their built urls will be rewritten to `/wp-content/themes/${themeSlug}/${filename}` to ensure that they can be loaded in your theme.
> Note that this feature uses [experimental.renderBuiltUrl](https://vite.dev/guide/build.html#advanced-base-options)

## Options

### Customizing theme slug
You can specify the name/slug of your theme, this is also going to be the resulting prefix in theme related function invocations

```ts
wordpressTheme({
  themeSlug: "my-awesome-theme",
}),
```

## Known bugs and issues
In case you have found a bug or issue please kindly [create an issue](https://github.com/devn1kov/vitepress-theme/issues/new)

- React Router weird behaviour when using lazy Components and loaders (TODO: Create issue and add details)
