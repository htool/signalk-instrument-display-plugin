const assert = require('assert')
const fs = require('fs')
const path = require('path')

const html = fs.readFileSync(
  path.join(__dirname, '../public/index.html'),
  'utf8'
)
const plugin = fs.readFileSync(
  path.join(__dirname, '../plugin/index.js'),
  'utf8'
)
const readme = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8')

assert.match(html, /electrical\.displays\.brightness/)
assert.match(html, /environment\.mode/)
assert.match(html, /style\.filter = 'brightness\(' \+ brightnessLevel \+ '\)'/)
assert.match(html, /n \/ 10/)
assert.match(html, /intentBrightnessSeen/)
assert.match(html, /applyIntentBrightness/)
assert.match(html, /applyBlobBacklight/)
assert.doesNotMatch(html, /0\.5\+\(brightnessLevel \/ 20\)/)
assert.match(html, /setBrightnessLevel\(\)/)
assert.doesNotMatch(plugin, /nmea2000out/)
assert.doesNotMatch(plugin, /nmea2000JsonOut/)
assert.match(readme, /electrical\.displays\.brightness/)
assert.match(readme, /environment\.mode/)

console.log('ok')
