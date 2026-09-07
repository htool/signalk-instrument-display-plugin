const http = require('http')
const fs = require('fs')
const path = require('path')
const { URL } = require('url')

const publicDir = path.join(__dirname, '../public')
const puts = []
let status = { mode: 'day', backlight: 6 }

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.ttf': 'font/ttf'
}

function send (res, statusCode, body, headers) {
  res.writeHead(statusCode, Object.assign({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }, headers || {}))
  res.end(body)
}

function serveFile (res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, 'not found')
      return
    }
    send(res, 200, data, {
      'Content-Type': mime[path.extname(filePath)] || 'application/octet-stream'
    })
  })
}

const options = {
  style: 'BandG',
  sources: [],
  displays: [{
    name: 'test',
    pages: [{ layout: '1', sources: [] }]
  }]
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1')

  if (req.method === 'OPTIONS') {
    send(res, 204, '')
    return
  }

  if (url.pathname === '/signalk/v1/api/vessels/self/environment/displayMode/value') {
    send(res, 200, JSON.stringify(status), { 'Content-Type': 'application/json' })
    return
  }

  if (url.pathname === '/signalk/v1/api/vessels/self/environment/mode/value') {
    send(res, 200, JSON.stringify(status.mode), { 'Content-Type': 'application/json' })
    return
  }

  if (url.pathname === '/signalk/v1/api/vessels/self/navigation/state/value') {
    send(res, 404, 'missing')
    return
  }

  if (url.pathname === '/signalk/v1/api/vessels/self/environment/displayMode/control') {
    let raw = ''
    req.on('data', (chunk) => { raw += chunk })
    req.on('end', () => {
      let body
      try {
        body = JSON.parse(raw || '{}')
      } catch (err) {
        send(res, 400, 'bad json')
        return
      }
      puts.push({ method: req.method, path: url.pathname, body: body })
      if (body && body.value) {
        if (body.value.mode === 'day' || body.value.mode === 'night') {
          status.mode = body.value.mode
        }
        const level = parseInt(body.value.backlight, 10)
        if (level >= 1 && level <= 10) {
          status.backlight = level
        }
      }
      send(res, 200, JSON.stringify({ state: 'COMPLETED', statusCode: 200 }), {
        'Content-Type': 'application/json'
      })
    })
    return
  }

  if (url.pathname === '/__puts') {
    send(res, 200, JSON.stringify(puts), { 'Content-Type': 'application/json' })
    return
  }

  if (url.pathname === '/plugins/signalk-instrument-display-plugin/options') {
    send(res, 200, JSON.stringify(options), { 'Content-Type': 'application/json' })
    return
  }

  if (url.pathname === '/' || url.pathname === '/index.html') {
    serveFile(res, path.join(publicDir, 'index.html'))
    return
  }

  const relative = decodeURIComponent(url.pathname.replace(/^\//, ''))
  const filePath = path.normalize(path.join(publicDir, relative))
  if (!filePath.startsWith(publicDir)) {
    send(res, 403, 'forbidden')
    return
  }
  serveFile(res, filePath)
})

const port = process.env.PORT || 3456
server.listen(port, '127.0.0.1', () => {
  console.log('mock SK listening on http://127.0.0.1:' + port + '/?display=test')
})
