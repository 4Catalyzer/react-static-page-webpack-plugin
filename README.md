# ReactStaticPageWebpackPlugin

A webpack plugin that generates an html page from a react component

## Usage

```sh
yarn add react-static-page-webpack-plugin -D
```

**webpack.config.js**

```js
exports = {
  entry './src/static-page.js',
  output: {
    libraryTarget: 'commonjs'
  }
  plugins: [
    new ReactStaticPageWebpackPlugin({
      fileName: 'static-index.html',
      title: 'My Page Title',
      props: {
        customerName: 'Sally'
      }
    }),
  ],
};
```

And in `./src/static-page.js`:

```js
import React from 'react';

export default function StaticPage({ customerName }) {
  return <main>Hi there: {customerName}</main>;
}
```

When running the webpack build `static-index.html` will be written to your output folder.

### Options

- `chunk`: Specific the entry chunk that returns the body component you want to render, optional, will use the first chunk when omitted
- `fileName`: The output file name
- `title`: A page title placed in teh `<head>`
- `meta`: a _string_ of meta tags placed into the document `<head>`
- `props`: An set of props that is passed to your component.

### Why use a webpack chunk?

The reason we use an entry chunk (instead of providing a filename to the component) is so you can leaverage your existing webpack config for styling, and compilation.
