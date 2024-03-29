# babel-plugin-transform-import-meta-x

This is a Babel plugin that transforms `import.meta` subproperty access to any other literal value.

This module is derived from the [babel-plugin-transform-import-meta](https://github.com/javiertury/babel-plugin-transform-import-meta) project.

## Usage:

```js
{
  "plugins": [
    "babel-plugin-transform-import-meta-x",
    { replacements: { foobar: '{}' } }
  ]
}
```

Run on the following code it will produce the following output:
  
```js
// src.js
console.log(import.meta.foobar);
// output:
console.log({});
```