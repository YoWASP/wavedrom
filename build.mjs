import { build } from 'esbuild';
import { componentize } from '@bytecodealliance/componentize-js';
import { readFile, writeFile } from 'node:fs/promises';

// Bundle, for npm
await build({
  logLevel: 'info',
  entryPoints: ['lib/api.js'],
  bundle: true,
  format: 'esm',
  outfile: 'out/bundle.js',
});

// Componentize, for PyPI
// This isn't currently used pending https://github.com/bytecodealliance/wasmtime-py/pull/224,
// but is planned for later use and kept tested in the meantime.
const { component } = await componentize(`\
${await readFile('out/bundle.js', 'utf8')}

export function renderJson(sourceJSON) {
  return render(JSON.parse(sourceJSON));
}
`, `\
package local:wavedrom;

world wavedrom {
  export render-json: func(json: string) -> string;
}
`, {
  disableFeatures: ['random', 'stdio', 'clocks']
});
await writeFile('out/wavedrom.component.wasm', component);

// Bundle, for PyPI
// This is what's actually used right now.
await build({
  logLevel: 'info',
  entryPoints: ['lib/api.js'],
  bundle: true,
  format: 'cjs',
  outfile: 'pypi/yowasp_wavedrom/bundle.js',
});
