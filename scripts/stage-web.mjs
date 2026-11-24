import {copyFileSync, mkdirSync} from 'node:fs';

const web = new URL('../web/index.html', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
mkdirSync(dist, {recursive:true});
copyFileSync(web, new URL('index.html', dist));
console.log('Staged the bundled Divoids app for offline play.');
