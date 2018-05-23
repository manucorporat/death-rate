const sass = require('@stencil/sass');

exports.config = {
  outputTargets: [{
    type: 'www',
    inlineLoaderScript: false,
    prerenderFilter: () => false
  }],
  globalStyle: 'src/global/app.css',
  enableCache: false,
  plugins: [
    sass()
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
