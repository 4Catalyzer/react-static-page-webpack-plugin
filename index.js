/* eslint-disable no-param-reassign */

const path = require('path');
const { debuglog } = require('util');

const evalModule = require('eval');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { sources } = require('webpack');

const debug = debuglog('ReactStaticPageWebpackPlugin');

const name = 'StaticPageGenerator';

const PLUGIN_REFS = Symbol(name);

class StaticPageGenerator {
  constructor({ chunk, fileName, props, head, title, inlineCss = true } = {}) {
    this.chunk = chunk;
    this.fileName = fileName;
    this.props = props;
    this.options = {
      title,
      head,
      inlineCss,
    };
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(name, (compilation) => {
      if (compilation[PLUGIN_REFS] == null) compilation[PLUGIN_REFS] = 0;

      compilation[PLUGIN_REFS]++;

      compilation.hooks.optimizeAssets.tap(name, () => {
        compilation[PLUGIN_REFS]--;
        const { head, title, inlineCss } = this.options;
        const json = compilation.getStats().toJson();

        const chunkName = this.chunk || Object.keys(json.assetsByChunkName)[0];
        let entryFile = json.assetsByChunkName[chunkName];
        if (Array.isArray(entryFile))
          entryFile = entryFile.find((f) => f.endsWith('.js'));

        const component = evalModule(compilation.assets[entryFile].source());

        const src = new sources.RawSource(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width" />
    ${head || ''}
    ${title ? `<title>${title}</title>` : ''}
    ${Object.entries(compilation.assets)
      .filter((p) => p[0].endsWith('.css'))
      .map(([href, css]) =>
        inlineCss
          ? `<style type="text/css">${css.source()}</style>`
          : `<link href="${path.join(
              compilation.outputOptions.publicPath || '/',
              href,
            )}" rel="stylesheet">`,
      )}
  </head>
  <body>
    ${renderToStaticMarkup(
      React.createElement(component.default || component, this.props),
    )}
  </body>
</html>`);

        if (compilation[PLUGIN_REFS] <= 0) {
          json.assetsByChunkName[chunkName].forEach((asset) => {
            if (asset.endsWith('.css')) return;
            debug('removing asset: ', asset);
            compilation.deleteAsset(asset);
          });
        }

        compilation.emitAsset(this.fileName, src);
      });
    });
  }
}

module.exports = StaticPageGenerator;
