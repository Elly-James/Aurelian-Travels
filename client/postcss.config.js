// postcss.config.js
module.exports = {
    plugins: {
      autoprefixer: {},  // Adds vendor prefixes (like -webkit-)
      cssnano: {         // Minifies CSS
        preset: 'default'
      }
    }
  };