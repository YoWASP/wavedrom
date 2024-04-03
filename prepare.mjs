import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

const revCount = execFileSync('git', ['rev-list', 'HEAD'], {encoding: 'utf-8'}).split('\n').length - 1;

const packageJSON = JSON.parse(readFileSync('package-in.json', {encoding: 'utf-8'}));
const wavedromVersion = packageJSON.dependencies.wavedrom;

const npmVersion = `${wavedromVersion}-${revCount}`;
console.log(`version ${npmVersion} (NPM)`);
packageJSON.version = npmVersion;
writeFileSync('package.json', JSON.stringify(packageJSON, null, 4));

const pypiVersion = `${wavedromVersion}.${revCount}`;
console.log(`version ${pypiVersion} (PyPI)`);
writeFileSync('pypi/version.txt', pypiVersion);
