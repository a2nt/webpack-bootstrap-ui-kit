/*
 * Common Environment
 */

const INDEX_NAME = 'app';
const YML_PATH = './webpack.yml';
const CONF_VAR = 'A2nt\\CMSNiceties\\Templates\\WebpackTemplateProvider';

const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const webpack = require('webpack');

/*
 * Load webpack configuration from webpack.yml
 */

const yml = yaml.load(
    fs.readFileSync(path.join(__dirname, YML_PATH), 'utf8'),
);
const conf = yml[CONF_VAR];

let themes = [];
// add themes
if (conf.THEMESDIR) {
  const themeDir = conf.THEMESDIR;
  const dir = path.resolve(__dirname, themeDir);

  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
        filePath = path.join(themeDir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
          themes.push(filePath);
        }
      });
  }
}

/* Setup Entries */
const includes = {};
const modules = [
    path.resolve(__dirname, conf.APPDIR, conf.SRC),
    path.resolve(__dirname, conf.APPDIR, conf.SRC, 'js'),
    path.resolve(__dirname, conf.APPDIR, conf.SRC, 'scss'),
    path.resolve(__dirname, conf.APPDIR, conf.SRC, 'img'),
    path.resolve(__dirname, conf.APPDIR, conf.SRC, 'thirdparty'),
    path.resolve(__dirname, 'node_modules'),
    path.resolve(__dirname),
    path.resolve(__dirname, 'public'),
];

const _addAppFiles = (theme) => {
    const dirPath = './' + theme;
    let themeName = path.basename(theme);
    if (themeName == '.') {
      themeName = 'app';
    }

    if (fs.existsSync(path.join(dirPath, conf.SRC, 'js', INDEX_NAME + '.js'))) {
      includes[`${themeName}`] = path.join(dirPath, conf.SRC, 'js', INDEX_NAME + '.js');
    } else if (
        fs.existsSync(path.join(dirPath, conf.SRC, 'scss', INDEX_NAME + '.scss'))
    ) {
      includes[`${themeName}`] = path.join(
          dirPath,
          conf.SRC,
          'scss',
          INDEX_NAME + '.scss',
      );
    }

    modules.push(path.join(dirPath, conf.SRC, 'js'));
    modules.push(path.join(dirPath, conf.SRC, 'scss'));
    modules.push(path.join(dirPath, conf.SRC, 'img'));
    modules.push(path.join(dirPath, conf.SRC, 'thirdparty'));

    const _getAllFilesFromFolder = function (dir, includeSubFolders = true) {
        const dirPath = path.resolve(__dirname, dir);
        let results = [];

        fs.readdirSync(dirPath).forEach((file) => {
            if (file.charAt(0) === '_') {
              return;
            }

            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);

            if (stat && stat.isDirectory() && includeSubFolders) {
              results = results.concat(
                  _getAllFilesFromFolder(filePath, includeSubFolders),
              );
            } else {
              results.push(filePath);
            }
          });

        return results;
      };

    // add page specific scripts
    const typesJSPath = path.join(theme, conf.TYPESJS);
    if (fs.existsSync(typesJSPath)) {
      const pageScripts = _getAllFilesFromFolder(typesJSPath, true);
      pageScripts.forEach((file) => {
          includes[`${themeName}_${path.basename(file, '.js')}`] = file;
        });
    }

    // add page specific scss
    const typesSCSSPath = path.join(theme, conf.TYPESSCSS);
    if (fs.existsSync(typesSCSSPath)) {
      const scssIncludes = _getAllFilesFromFolder(typesSCSSPath, true);
      scssIncludes.forEach((file) => {
          includes[`${themeName}_${path.basename(file, '.scss')}`] = file;
        });
    }
  };

_addAppFiles(conf.APPDIR);

// add themes
themes.forEach((theme) => {
    _addAppFiles(theme);
  });

module.exports = {
    configuration: conf,
    themes: themes,
    webpack: {
        entry: includes,
        externals: {
            // comment out jQuery if you don't use it to prevent bootstrap thinking that there's jQuery present
            //jquery: 'jQuery',
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        resolve: {
            modules: modules,
            extensions: ['.tsx', '.ts', '.js'],
            alias: {
              // comment out jQuery if you don't use it to prevent bootstrap thinking that there's jQuery present
              /*'window.jQuery': require.resolve('jquery'),
              $: require.resolve('jquery'),
              jquery: require.resolve('jquery'),
              jQuery: require.resolve('jquery'),
              react: require.resolve('react'),
              'react-dom': require.resolve('react-dom'),*/
            },
            fallback: {
                path: false,
              },
          },
        experiments: {
            topLevelAwait: true,
          },
      },
  };
