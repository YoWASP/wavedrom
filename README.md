YoWASP WaveDrom package
=======================

This package provides a self-contained [WaveDrom] renderer for JavaScript and Python applications. See the [overview of the YoWASP project][yowasp] for details.

[WaveDrom]: https://wavedrom.com/
[yowasp]: https://yowasp.org/

Command-line tool
-----------------

This package installs a command-line tool `yowasp-wavedrom`.

```
Usage: yowasp-wavedrom [<input.json>] [<output.svg>]
```

API reference (JavaScript)
--------------------------

The [@yowasp/wavedrom] package has one entry point, `render(source): string`. It accepts a JavaScript object in the WaveJSON format and returns an SVG image serialized as a string:

```js
import { render } from '@yowasp/wavedrom';

console.log(render({signal: [{ name: "clk", wave: "p..." }, { name: "data", wave: "01.0" }]}));
// => <svg.../svg>
```

[@yowasp/wavedrom]: https://www.npmjs.com/package/@yowasp/wavedrom

API reference (Python)
----------------------

The [yowasp-wavedrom] package has one entry point, `render(source) -> str`. It accepts a Python dictionary in the WaveJSON format and returns an SVG image serialized as a string:

```py
from yowasp_wavedrom import render

print(render({"signal": [{ "name": "clk", "wave": "p..." }, { "name": "data", "wave": "01.0" }]}))
# => <svg.../svg>
```

[yowasp-wavedrom]: https://pypi.org/project/yowasp-wavedrom

Implementation notes
--------------------

This package embeds the [upstream WaveDrom library][upstream] bundled with the minimal amount of dependencies necessary to produce a serialized SVG, and, for the Python package, with a JavaScript runtime. In addition, the output is post-processed compared to the upstream library as follows:

* The `id` attribute of the root `<svg>` element is removed.
* The stylesheets are altered to take into account dark color scheme preference via media queries. If the user agent reports dark color scheme preference, the colors in the diagram are inverted.
    * In case of the `dark` waveform diagram skin, this will cause it to use light colors.
    * When the SVG image is embedded in an HTML document using the `<img>` tag, the color scheme preference can be set per-image using a CSS rule such as `img { color-scheme: light; }`. This can be used to make the images responsive to dynamic theming, or simply to override the default behavior.
* Several otherwise blocking bugs are worked around.

[upstream]: https://npmjs.org/package/wavedrom

Updates
-------

Unlike most [YoWASP] packages, this package does not automatically track upstream releases. Please [open a pull request](https://github.com/YoWASP/wavedrom/pulls) bumping the version of `wavedrom` in `package-in.json` if you need a feature from a newer version of [WaveDrom].

License
-------

This package is covered by the [MIT license](LICENSE.txt).
