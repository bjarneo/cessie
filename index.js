const fs = require('fs');
const meow = require('meow');
const fileExtension = require('file-extension');
const postcss = require('postcss');
const sass = require('node-sass');
const less = require('less');
const csso = require('csso');

const cli = meow(`
    Usage
      $ cessie <input> -o filename.css

    Options
      --outfile, -o Name of the outfile
      --minify,  -m Minify css. Defaults to true.

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
        }
    }
});

const transpileSass = content =>
    sass.renderSync({
        data: content,
    }).css;

const transpileLess = async content => {
    const { css } = await less.render(content);

    return css;
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
        .on('close', () => resolve(chunks)));
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

    const { outfile, minify } = cli.flags;

    if (!inputFile) {
        console.log(' [x] No input file');

        return;
    }

    console.log(` [*] Transpiling ${inputFile} to ${outfile}`);

    const inputCSS = await getFileContent(inputFile);

    const toCSS = await transpile(inputCSS.toString(), inputFile);

    const { css } = await postcss([
        require('postcss-css-variables')({ preserve: false }),
        require('autoprefixer'),
        require('postcss-calc'),
        require('postcss-preset-env')
    ]).process(toCSS, { from: false });

    const outCSS = minify ? csso.minify(css).css : css;

    await writeFileContent(outfile, outCSS);

    console.log(` [*] Finished writing file: ${outfile}`);
}

main();
