var chokidar = require('chokidar');
var glob = require('glob');
var webfontsGenerator = require('webfonts-generator');

function AfomWebFonts(options) {
    // parse options
    options = options || {};

    // default options
    var defaultOptions = {
        files       : glob.sync('./src/icons/**/*.svg'),
        fontName    : 'icons-font',
        dest        : './public/fonts',
        cssTemplate : __dirname + '/template/scss.hbs'
    };

    // merge custom options to default ones
    options = Object.assign(defaultOptions, options,
        {
            files: typeof options.files === 'string' ? glob.sync(options.files) : options.files || defaultOptions.files
        }
    );

    if (options.watch) {
        // watch for files changes
        chokidar.watch(options.files).on('all', function(event, path) {
            this.generateWebfont(options, function() {
                console.log(event, path);
            });
        });
    } else {
        // or just generate webfont files
        this.generateWebfont(options);
    }
};

/**
 * Generate webfont files using webfonts-generator
 *
 * @param {object} options
 * @param {function} [onSuccess]
 * @param {function} [onError]
 */
AfomWebFonts.prototype.generateWebfont = function(options, onSuccess, onError) {
    // define on success callback
    onSuccess = typeof onSuccess === 'function' ? onSuccess : function() {
        console.log('Font(s) created in', options.dest);
    }

    // define on error callback
    onError = typeof onError === 'function' ? onError : function(error) {
        console.log('Fail!', error);
    }

    // generate webfont files
    webfontsGenerator(options, function (error) {
        if (error) {
            onError(error);
            return;
        }

        onSuccess();
    });
}

module.exports = AfomWebFonts;
