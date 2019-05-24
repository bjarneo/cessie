# cessie

> Transpile your CSS bundle to support CSS variables, calc, and future CSS for legacy browsers.

![cessie logo](https://github.com/bjarneo/cessie/blob/master/logo.png?raw=true)

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


## Example

mybundle.less
```
:root {
  --background-color: #dd0000;
  --font-color: #fff;
  --padding: 10px;
  --border-color: #bad;
}

button {
    color: var(--font-color);
    border: none;
    padding: 20px 30px;
    font-size: 24px;
    background-color: var(--background-color);
    cursor: pointer;
    transition: opacity .15s ease-in-out;
    border-radius: 1px solid var(--border-color);

    .some-third-class {
        --background-color: steelblue;
        --font-color: tomato;

        padding: calc(var(--padding) * 2);
        background-color: var(--background-color);
        color: var(--font-color);
    }

    &:hover {
        opacity: 0.5;
        transform: scale(0.5);
    }
}

@bg: black;
@bg-light: boolean(luma(@bg) > 50%);

div {
  background: @bg;
  color: if(@bg-light, black, white);
}

```

Run cessie
```
$ cessie mybundle.less -o output.css -m false
```

output.css
```
button {
  color: #fff;
  border: none;
  padding: 20px 30px;
  font-size: 24px;
  background-color: #dd0000;
  cursor: pointer;
  transition: opacity 0.15s ease-in-out;
  border-radius: 1px solid #bad;
}
button .some-third-class {
  padding: 20px;
  background-color: steelblue;
  color: tomato;
}
button:hover {
  opacity: 0.5;
  -webkit-transform: scale(0.5);
          transform: scale(0.5);
}
div {
  background: black;
  color: white;
}

```


## Want features?

Please write an issue.


## License

MIT © [Bjarne Øverli](https://oeverli.win)
