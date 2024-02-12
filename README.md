[![Inidot banner](./.github/assets/banner.jpg)](https://github.com/inicontent/inidot)

# Inidot :pencil:

[![npmjs](https://img.shields.io/npm/dm/inidot.svg?style=flat)](https://www.npmjs.org/package/inidot) [![License](https://img.shields.io/github/license/inicontent/inidot.svg?style=flat&colorA=18181B&colorB=28CF8D)](./LICENSE) [![Activity](https://img.shields.io/github/commit-activity/m/inicontent/inidot)](https://github.com/inicontent/inidot/pulse) [![GitHub stars](https://img.shields.io/github/stars/inicontent/inidot?style=social)](https://github.com/inicontent/inidot)

> Get, set, or delete a property from a nested object using a dot path :fire:

## Features

- **Lightweight** 🪶
- **Minimalist** :white_circle: (but powerful)
- **TypeScript** :large_blue_diamond:
- **Super-Fast** :zap:
- **Suitable for large data** :page_with_curl:
- **Safe** :lock:
- **Easy to use** :bread:
- **...** and much more :rocket:

## Usage

```js
import Inidot from "inidot";
// or
import {
  toDotNotation,
  getProperty,
  setProperty,
  deleteProperty,
  hasProperty
} from "inidot";

const myObj = {
  name: "Jo,hn",
  age: 21,
  address: {
    city: "New York",
    zip: 65221,
  },
  hobbies: ["Reading", "Tra[veling", ["test", "test2", { test: true }]],
};

// Get Property by path
Inidot.getProperty(myObj, "address.city");
// New York

// Get Unexisted Property by path
Inidot.getProperty(myObj, "address.country");
// undefined

// Define a default value
Inidot.getProperty(myObj, "address.city", "Morocco");
// Morocco
```

### Selector Examples

```
- `obj.value` => `['obj', 'value']`
- `obj.ary.0.value` => `['obj', 'ary', '0', 'value']`
- `obj.ary.0.va\\.lue` => `['obj', 'ary', '0', 'va.lue']`
- `obj.ary.*.value` => `['obj', 'ary', '*', 'value']`
```

If you like Inidot, please sponsor: [GitHub Sponsors](https://github.com/sponsors/inicontent) || [Paypal](https://paypal.me/KarimAmahtil).

## Install

```js
<npm|pnpm|yarn> install inidot
```

## License

[MIT](./LICENSE)
