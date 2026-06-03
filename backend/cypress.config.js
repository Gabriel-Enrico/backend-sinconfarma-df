const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8000',
    specPattern: 'cypress/{api,e2e}/**/*.spec.js',
    supportFile: false,
    setupNodeEvents(on, config) {
      // no-op
    },
  },
});
