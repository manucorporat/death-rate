const sass = require('@stencil/sass');

exports.config = {
  outputTargets: [{
    type: 'www',
    inlineLoaderScript: false,
  }],
  enableCache: false,
  globalStyle: 'src/app.css',
  plugins: [
    sass()
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
