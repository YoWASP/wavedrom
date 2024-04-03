#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { render } from '@yowasp/wavedrom';

const args = process.argv.slice(2);
if (!(args.length >= 0 && args.length <= 2)) {
    console.error(`Usage: yowasp-wavedrom [- | <input.json>] [- | <output.svg>]`);
    process.exit(1);
}

const inputPathOrFd = (args[0] === undefined || args[0] === '-') ? process.stdin.fd : args[0];
const outputPathOrFd = (args[1] === undefined || args[1] === '-') ? process.stdout.fd : args[1];

const source = JSON.parse(readFileSync(inputPathOrFd, 'utf-8'));
const output = render(source);
writeFileSync(outputPathOrFd, output, 'utf-8');
