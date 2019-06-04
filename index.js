const fs = require('fs');
const path = require('path');
const watchFile = require('node-watch');
const meow = require('meow');
const fileExtension = require('file-extension');
const postcss = require('postcss');
const sass = require('node-sass');
const less = require('less');

require('log-timestamp');

const cli = meow(`
    Usage
      $ cessie <input> -o filename.css

    Options
      --outFile,     -o Name of the outfile
      --minify,      -m Minify css. Defaults to true.
      --watch,       -w Watch for file changes. Defaults to false.
      --source-map,  -s Generate source map. Defaults to true.
      --import-from, -i Import CSS variables from file (https://github.com/postcss/postcss-custom-properties#importfrom)
      --export-to,   -e Export CSS variables to file (https://github.com/postcss/postcss-custom-properties#exportto)

    Examples
      $ cessie bundle.css -o ie11.css
`, {
    flags: {
        outfile: {
            type: 'string',
            alias: 'o',
            default: 'ie11.css'
        },
        minify: {
            type: 'boolean',
            alias: 'm',
            default: true
        },
        watch: {
            type: 'boolean',
            alias: 'w',
            default: false
        },
        'source-map': {
            type: 'boolean',
            alias: 's',
            default: true
        },
        'import-from': {
            type: 'string',
            alias: 'i',
            default: ''
        }
    }
});

const [inputFile] = cli.input;
const { outfile, minify, watch, sourceMap, importFrom } = cli.flags;

const transpileSass = (content) => {
    try {
        const { css, map } = sass.renderSync({
            data: content,
            outFile: outfile,
            sourceMap: true,
        });

        return { css, map };
    } catch (e) {
        console.error(e);
    }
}

const transpileLess = async (content) => {
    try {
        const { css, map } = await less.render(content, {
            sourceMap: {
                outputFilename: outfile + '.map',
            },
        });

        return { css, map };
    } catch (e) {
        console.error(e);
    }
}

async function transpile(content) {
    const extension = fileExtension(inputFile);

    switch (extension) {
        case 'css':
            return { css: content, map: '' };

        case 'scss':
            return await transpileSass(content);

        case 'sass':
            return await transpileSass(content);

        case 'less':
            return await transpileLess(content);
    }
}

async function getFileContent() {
    const chunks = [];

    return new Promise((resolve, reject) =>
        fs.createReadStream(inputFile)
        .on('data', chunk => chunks.push(chunk))
        .on('error', err => reject(err))
        .on('close', () => resolve(chunks.join(''))));
}

async function writeFileContent(outfile, content) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(outfile);

        file.write(content);

        file.end(() => resolve());
    });
}

function addSourceMapURL(css) {
    if (sourceMap) {
        css += ` /* # sourceMappingURL=${path.basename(outfile)}.map */`;
    }

    return css;
}

async function generateCSS() {
    const transpiled = await transpile(await getFileContent());

    const plugins = [];

    plugins.push(...[
        require('postcss-custom-properties')({ preserve: false, exportTo, importFrom }),
        require('postcss-calc'),
        require('autoprefixer'),
        require('postcss-preset-env')
    ]);

    if (minify && !watch) {
        plugins.push(require('postcss-csso'));
    }

    const { css } = await postcss(plugins).process(transpiled.css, { from: false });

    return {
        css: addSourceMapURL(css),
        map: transpiled.map,
    };
};

async function main() {
    if (!inputFile) {
        console.log(' [x] No input file');

        return;
    }

    console.log(` [*] Transpiling ${inputFile} to ${outfile}`);

    if (watch) {
        const folder = path.resolve(path.dirname(inputFile));

        const opts = {
            filter: new RegExp(`\\${path.extname(inputFile)}$`),
            recursive: true,
        };

        const watcher = watchFile(folder, opts, async (event, name) => {
            console.log(` [*] Watching and writing ${inputFile} to ${outfile}`);

            const { css } = await generateCSS();

            await writeFileContent(outfile, css);
        });

        watcher.on('error', err => console.error(' [x] %s', err));
    }

    const { css, map } = await generateCSS();

    writeFileContent(outfile, css);

    if (sourceMap) {
        writeFileContent(outfile + '.map', map);
    }

    console.log(` [*] Finished writing file: ${outfile}`);
}

main();
