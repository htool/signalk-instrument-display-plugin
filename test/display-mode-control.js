const assert = require('assert')
const fs = require('fs')
const http = require('http')
const path = require('path')

const control = require('../public/js/display-mode-control.js')

assert.strictEqual(control.STATUS_PATH, 'environment.displayMode')
assert.strictEqual(control.CONTROL_PATH, 'environment.displayMode.control')
assert.strictEqual(
  control.CONTROL_URL,
  '/signalk/v1/api/vessels/self/environment/displayMode/control'
)
assert.strictEqual(
  control.STATUS_URL,
  '/signalk/v1/api/vessels/self/environment/displayMode/value'
)

assert.strictEqual(control.clampBacklight(1), 1)
assert.strictEqual(control.clampBacklight('10'), 10)
assert.strictEqual(control.clampBacklight(0), null)
assert.strictEqual(control.clampBacklight(11), null)
assert.strictEqual(control.clampBacklight('nope'), null)

assert.strictEqual(control.normalizeMode('night'), 'night')
assert.strictEqual(control.normalizeMode('day'), 'day')
assert.strictEqual(control.normalizeMode('dusk'), null)

assert.deepStrictEqual(control.parseStatus({ mode: 'night', backlight: 3 }), {
  mode: 'night',
  backlight: 3
})
assert.deepStrictEqual(control.parseStatus({ backlight: '7' }), {
  mode: null,
  backlight: 7
})
assert.deepStrictEqual(control.parseStatus(8), {
  mode: null,
  backlight: 8
})

assert.deepStrictEqual(control.buildControlValue('night', 4), {
  mode: 'night',
  backlight: 4
})
assert.deepStrictEqual(control.buildControlValue('day', 10, 'Default'), {
  mode: 'day',
  backlight: 10,
  group: 'Default'
})
assert.deepStrictEqual(control.buildControlValue('night', 1, 2), {
  mode: 'night',
  backlight: 1,
  group: '2'
})
assert.deepStrictEqual(control.buildPutBody('night', 5), {
  value: { mode: 'night', backlight: 5 }
})

const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8')
assert.match(html, /js\/display-mode-control\.js/)
assert.match(html, /DisplayModeControl\.CONTROL_URL/)
assert.match(html, /type:\s*['"]PUT['"]/)
assert.match(html, /lightingSlider/)
assert.match(html, /environment\.displayMode/)
assert.doesNotMatch(
  html,
  /\/signalk\/v1\/api\/vessels\/self\/environment\/displayMode['"]/
)
assert.doesNotMatch(html, /nmea2000out/)

const plugin = fs.readFileSync(path.join(__dirname, '../plugin/index.js'), 'utf8')
assert.doesNotMatch(plugin, /nmea2000out/)
assert.doesNotMatch(plugin, /environment\.displayMode/)

function putControl (body, cb) {
  const server = http.createServer((req, res) => {
    let raw = ''
    req.on('data', (chunk) => { raw += chunk })
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end('{"state":"COMPLETED"}')
      server.close()
      cb(null, { method: req.method, url: req.url, body: JSON.parse(raw) })
    })
  })
  server.listen(0, '127.0.0.1', () => {
    const port = server.address().port
    const req = http.request({
      host: '127.0.0.1',
      port: port,
      path: control.CONTROL_URL,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => { res.resume() })
    req.on('error', cb)
    req.end(JSON.stringify(body))
  })
}

putControl(control.buildPutBody('night', 3, 'Default'), (err, seen) => {
  assert.ifError(err)
  assert.strictEqual(seen.method, 'PUT')
  assert.strictEqual(seen.url, '/signalk/v1/api/vessels/self/environment/displayMode/control')
  assert.deepStrictEqual(seen.body, {
    value: { mode: 'night', backlight: 3, group: 'Default' }
  })
  console.log('ok')
})
