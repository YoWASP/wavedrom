import { render as renderNative } from '../lib/api.js';
import { renderJson as renderComponentJson } from './out/wavedrom.component.js'
import { writeFile } from 'node:fs/promises';

function renderComponent(source) {
    return renderComponentJson(JSON.stringify(source));
}

function run(render) {
    const signalSvg = render({
        signal: [
            { name: "clk",  wave: "p......" },
            { name: "bus",  wave: "x.34.5x",   data: "head body tail" },
            { name: "wire", wave: "0.1..0." },
        ]
    });

    const regSvg = render({
        reg: [
            {"name": "first",  "bits": 3},
            {"name": "second", "bits": 7},
            {"name": "third",  "bits": 6},
            {"name": "",       "bits": 16}
        ],
        config: {
            lanes: 2,
            compact: true,
            vflip: true
        }
    });

    const assignSvg = render({
        assign: [["out", ["|", ["&", ["~", "a"], "b"], ["&", ["~", "b"], "a"]]]]
    });

    return { signalSvg, regSvg, assignSvg };
}

const outComponent = run(renderComponent);
const outNative = run(renderNative);

if (outComponent.signalSvg !== outNative.signalSvg)
    throw new Error("signalSvg does not match");
if (outComponent.regSvg !== outNative.regSvg)
    throw new Error("regSvg does not match");
if (outComponent.assignSvg !== outNative.assignSvg)
    throw new Error("assignSvg does not match");

await writeFile('out/signal.svg', outComponent.signalSvg);
await writeFile('out/reg.svg', outComponent.regSvg);
await writeFile('out/assign.svg', outComponent.assignSvg);
