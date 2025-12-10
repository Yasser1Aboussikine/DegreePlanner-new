const tsConfigPaths = require('tsconfig-paths');
const path = require('path');

const baseUrl = __dirname;
const paths = {
  '@/*': ['dist/*'],
  '@/generated/*': ['dist/generated/*']
};

tsConfigPaths.register({
  baseUrl,
  paths,
});
