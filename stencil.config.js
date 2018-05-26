const sass = require('@stencil/sass');

exports.config = {
  outputTargets: [{
    type: 'www',
    inlineLoaderScript: false,
  }],
  globalStyle: 'src/global/app.css',
  plugins: [
    sass()
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
