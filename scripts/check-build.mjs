import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {validateAppleSDK} from './check-apple-sdk.mjs';
import {nativeSettings} from './native-project.mjs';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root));
const {pkg, config} = nativeSettings(fileURLToPath(root), {});
const lock = JSON.parse(read('package-lock.json'));
assert.equal(lock.version, pkg.version);
assert.deepEqual(lock.packages[''].dependencies, pkg.dependencies);
assert.deepEqual(lock.packages[''].devDependencies, pkg.devDependencies);
assert.equal(config.appName, 'Divoids');

const html = read('web/index.html').toString();
for (const marker of ['Divoids · TestFlight', 'Planet Moz', 'divoid-coach-line', 'lifetimeSpotFinishes', 'Moonberry Catch']) {
  assert.ok(html.includes(marker), 'Missing app content: ' + marker);
}
assert.doesNotMatch(html, /<script[^>]+\bsrc=/i, 'Scripts must be bundled for offline play');
assert.doesNotMatch(html, /<link[^>]+rel="stylesheet"[^>]*>/i, 'Styles must be bundled for offline play');

const icon = read('native/AppIcon.png');
assert.equal(icon.subarray(1,4).toString(), 'PNG');
assert.equal(icon.readUInt32BE(16), 1024);
assert.equal(icon.readUInt32BE(20), 1024);
assert.equal(icon[25], 2, 'Apple requires an opaque RGB icon');
assert.deepEqual(validateAppleSDK('Xcode 27.2\n', '27.2'), {xcode:'27.2', sdk:'27.2'});
assert.throws(() => validateAppleSDK('Xcode 26.5', '26.5'));
console.log('Verified offline app, Apple icon, dependency lock, signing settings and SDK check.');
