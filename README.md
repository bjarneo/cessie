# cessie [css ie]

> Transpile your CSS bundle to support IE11 for CSS variables, calc, and future CSS.


## Features

- Uses PostCSS behind the scenes.
- Transpiles future CSS by using `postcss-preset-env`.
- Transpiles CSS variables and calc by using `postcss-css-variables`, and `postcss-calc`.
- Can be used for all CSS bundles.
- Can transpile SCSS, SASS, and LESS.
- Can minify the output if not already minified.


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
      --outfile, -o Name of the outfile
      --minify,  -m Minify css. Defaults to true

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
}

button {
    color: var(--font-color);
    border: none;
    padding: 20px 30px;
    font-size: 24px;
    background-color: var(--background-color);
    cursor: pointer;
    transition: opacity .15s ease-in-out;

    .some-third-class {
        --background-color: steelblue;
        --font-color: tomato;

        padding: calc(var(--padding) * 2);
    }

    .some-class {
        --background-color: #bad;
        --font-color: #171717;
    }

    &:hover {
        opacity: 0.5;
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
$ cessie mybundle.less -o ie11.css -m false
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
}
button .some-third-class {
  padding: 20px;
}
button:hover {
  opacity: 0.5;
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
