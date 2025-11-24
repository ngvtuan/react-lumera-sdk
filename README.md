<div align=center>

  [<img height="100px" src="./public/lumera-symbol.svg"/>](https://lumera.io/)

</div>

<p align=center>
  <b>Lumera Cascade</b>
</p>

<div align=center>

  [![Docs](https://img.shields.io/badge/doc-reference-%233F9AF7)](https://docs.pastel.network/introduction/pastel-overview)
  [![License](https://img.shields.io/github/license/pastelnetwork/pastel-electron-wallet)](https://github.com/pastelnetwork/pastel-qr-scanblob/master/LICENSE)
  [![Language](https://img.shields.io/badge/language-Typescript-%232b7489)](https://github.com/pastelnetwork/pastel-qr-scansearch?q=typescript)

</div>

---

Lumera Cascade is a built component for use with the Lumera SDK in Next.js.

## Installation

You can install this library via NPM or YARN.

### NPM

```bash
npm i lumera-cascade
```

### YARN

```bash
yarn add lumera-cascade
```

## Example Usage

After reading and performing the previous steps, you should be able to import the library and use it like in this example:

```javascript
import React, { useState } from 'react';
import { QrReader } from 'pastel-qr-scan';

const Test = (props) => {
  const [data, setData] = useState('No result');

  return (
    <>
      <QrScan
        onResult={(result) => {
          if (result) {
            setData(result?.text);
          }
        }}
      />
      <p>{data}</p>
    </>
  );
};
```

## Component API

The `Lumera Cascade` component has the following props:

| Properties          | Types                                                                                           | Default Value            | Description                                              |
| ------------------- | ----------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------------------- |
| onResult            | `function`                                                                                      | none                     | Scan event handler                                       |
| videoWidth             | `string`                                                                                        | `100%`                  | The width for the video element                             |
| videoHeight             | `string`                                                                                        | `100%`                  | The height for the video element                             |
| className           | `string`                                                                                         | none                     | ClassName for the container element.                     |

## Issues

Please, open an [issue](https://github.com/pastelnetwork/pastel-qr-scan/issues) following one of the issues templates. We will do our best to fix them.

## License

Distributed under the MIT license. See [LICENSE](LICENSE) for more information.