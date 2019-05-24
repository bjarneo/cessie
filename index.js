const fs = require('fs');
const path = require('path');
const watchFile = require('node-watch');
const meow = require('meow');
const fileExtension = require('file-extension');
const postcss = require('postcss');
const sass = require('node-sass');
const less = require('less');
const csso = require('csso');

require('log-timestamp');

const cli = meow(`
    Usage
      $ cessie <input> -o filename.css

    Options
      --outfile, -o Name of the outfile
      --minify,  -m Minify css. Defaults to true.
      --watch,   -w Watch for file changes. Defaults to false.

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
        }
    }
});

const transpileSass = (content) => {
    try {
        return sass.renderSync({
            data: content,
        }).css;
    } catch (e) {
        console.error(e);
    }
}

const transpileLess = async content => {
    try {
        const { css } = await less.render(content);

        return css;
    } catch (e) {
        console.error(e);
    }
}

async function transpile(content, inputFile) {
    const extension = fileExtension(inputFile);

    switch (extension) {
        case 'css':
            return content;

        case 'scss':
            return await transpileSass(content);

        case 'sass':
            return await transpileSass(content);

        case 'less':
            return await transpileLess(content);
    }
}

async function getFileContent(inputFile) {
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

async function main() {
    const [inputFile] = cli.input;

    const { outfile, minify, watch } = cli.flags;

    if (!inputFile) {
        console.log(' [x] No input file');

        return;
    }

    console.log(` [*] Transpiling ${inputFile} to ${outfile}`);

    const generateCSS = async () => {
        const inputCSS = await getFileContent(inputFile);

        const toCSS = await transpile(inputCSS.toString(), inputFile);

        const { css } = await postcss([
            require('postcss-css-variables')({ preserve: false }),
            require('autoprefixer'),
            require('postcss-calc'),
            require('postcss-preset-env')
        ]).process(toCSS, { from: false });

        return (minify && !watch) ? csso.minify(css).css : css;
    };

    await writeFileContent(outfile, await generateCSS());

    if (watch) {
        const folder = path.resolve(path.dirname(inputFile));

        const opts = {
            filter: new RegExp(`\\${path.extname(inputFile)}$`),
            recursive: true,
        };

        console.log(folder)

        const watcher = watchFile(folder, opts, async (event, name) => {
            console.log(` [*] Watching and writing ${inputFile} to ${outfile}`);

            await writeFileContent(outfile, await generateCSS());
        });

        watcher.on('error', err => console.error(' [x] %s', err));
    } else {
        console.log(` [*] Finished writing file: ${outfile}`);
    }
}

main();
