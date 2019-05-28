<br>

<p align="center">
  <a href="https://github.com/bjarneo/cessie">
    <img src="https://github.com/bjarneo/cessie/blob/master/logo.png?raw=true" alt="cessie logo" />
  </a>
</p>

<h1 align="center">cessie</h1>

<blockquote align="center">Transpile your CSS bundle to support CSS variables, calc, and future CSS for legacy browsers.</blockquote>

## Features

- Uses PostCSS behind the scenes.
- Transpiles future CSS by using `postcss-preset-env`.
- Transpiles CSS variables and calc by using `postcss-css-variables`, and `postcss-calc`.
- Can be used for all CSS bundles.
- Can transpile SCSS, SASS, and LESS.
- Can minify the output if not already minified.
- Watch mode.
- Source map.


## Case

Example usage of this CLI would be cases where you don't have the power, or will to edit/write postcss/webpack config for your application. One of those examples are Create React App.

Create React App:
```
$ npm run build
$ cat build/static/css/*.chunk.css >> bundle.css
$ cessie bundle.css -o ie11.css
```


## Install

```
$ npm i -g cessie
// Or use npx
$ npx cessie
```


## Usage

```
$ cessie inputFile.css -o ie11.css
```

```
    Usage
      $ cessie <input> -o filename.css

    Options
      --outFile,    -o Name of the outfile
      --minify,     -m Minify css. Defaults to true.
      --watch,      -w Watch for file changes. Defaults to false.
      --source-map, -s Generate source map. Defaults to true.

    Examples
      $ cessie bundle.css -o ie11.css
```


## Examples
```
// css/sass/less file
:root {
  --color: white;
  --padding: 10px;
}

div {
  color: var(--color);
  padding: calc(var(--padding) * 2);
}

// Run cessie with no minify
$ cessie my.css -o output.css -m false

// output.css
div {
  color: white;
  padding: 20px;
}
```

See more [examples](https://github.com/bjarneo/cessie/blob/master/EXAMPLES.md)


## Want features?

Please write an issue.


## License

MIT © [Bjarne Øverli](https://oeverli.win)
