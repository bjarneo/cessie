## CSS vars, autoprefixer, and calc()

`something.css`
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

    &:hover {
        opacity: 0.5;
        transform: scale(0.5);
    }
}
``` 


Run cessie
```
$ cessie something.css -o output.css -m false
```

`output.css`
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
button:hover {
  opacity: 0.5;
  -webkit-transform: scale(0.5);
          transform: scale(0.5);
}
```


# Sass

`something.scss`
```
$bg: black;
$font-color: white;

div {
  background: $bg;
  color: $font-color;
}

```

Run cessie
```
$ cessie something.scss -o output.css -m false
```

`output.css`
```
div {
  background: black;
  color: white;
}
```


## Less

`something.less`
```
@bg: black;
@bg-light: boolean(luma(@bg) > 50%);

div {
  background: @bg;
  color: if(@bg-light, black, white);
}

```

Run cessie
```
$ cessie something.less -o output.css -m false
```

`output.css`
```
div {
  background: black;
  color: white;
}
```
