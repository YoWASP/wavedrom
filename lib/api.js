import { default as onml_stringify } from 'onml/stringify.js';
import { default as WaveSkin_default } from 'wavedrom/skins/default.js';
import { default as WaveSkin_narrow } from 'wavedrom/skins/narrow.js';
import { default as WaveSkin_narrower } from 'wavedrom/skins/narrower.js';
import { default as WaveSkin_narrowerer } from 'wavedrom/skins/narrowerer.js';
import { default as WaveSkin_lowkey } from 'wavedrom/skins/lowkey.js';
import { default as WaveSkin_dark } from 'wavedrom/skins/dark.js';
import { default as WaveDrom_renderSignal } from 'wavedrom/lib/render-signal.js';
import { default as WaveDrom_renderReg } from 'wavedrom/lib/render-reg.js';
import { default as WaveDrom_renderAssign } from 'logidrom/lib/render-assign.js';

const WaveSkin = {
    light: WaveSkin_default.default,
    ...WaveSkin_dark,
    ...WaveSkin_narrow,
    ...WaveSkin_narrower,
    ...WaveSkin_narrowerer,
    ...WaveSkin_lowkey,
};

// Make the default skin respect browser dark mode.
WaveSkin.default = JSON.parse(JSON.stringify(WaveSkin.light));
// `laneParamsFromSkin` uses hardcoded offsets into the skin to derive parameters, so the tag
// structure of a skin must be preserved exactly, e.g. there can be exactly one <style> element.
WaveSkin.default[2][2] = `\
@media(prefers-color-scheme:light){${WaveSkin.light[2][2]}}\
@media(prefers-color-scheme:dark){${WaveSkin.dark[2][2]}}`;

function renderSignal(source) {
    const rendered = WaveDrom_renderSignal(0, source, WaveSkin);
    delete rendered[1]['id'];
    delete rendered[4][2][1]['style']; // workaround for https://github.com/wavedrom/wavedrom/issues/409
    return onml_stringify(rendered); // note: https://github.com/wavedrom/wavedrom/issues/412
}

function renderBitField(source) {
    const rendered = WaveDrom_renderReg(0, source);
    rendered.splice(2, 0, ['style', {}, '@media(prefers-color-scheme:dark){:root{filter:invert(1)}}']);
    return onml_stringify(rendered);
}

function renderCircuit(source) {
    const rendered = WaveDrom_renderAssign(0, source);
    delete rendered[1]['id'];
    rendered[1]['xmlns'] = 'http://www.w3.org/2000/svg'; // workaround for https://github.com/wavedrom/wavedrom/issues/413
    rendered.splice(3, 0, ['style', {}, '@media(prefers-color-scheme:dark){:root{filter:invert(1)}.gate{fill:#1c60a8}}']);
    return onml_stringify(rendered);
}

export function render(source) {
    if (source.signal && source.reg === undefined && source.assign === undefined)
        return renderSignal(source);
    if (source.signal === undefined && source.reg && source.assign === undefined)
        return renderBitField(source);
    if (source.signal === undefined && source.reg === undefined && source.assign)
        return renderCircuit(source);
    if (Object.keys(source).length == 0)
        throw new Error(`Cannot render empty object`);
    throw new Error(`Cannot render object with keys: ${Object.keys(source)}`);
}

// The only way to make working with this library tolerable was heavy drinking during development
// of this wrapper.
