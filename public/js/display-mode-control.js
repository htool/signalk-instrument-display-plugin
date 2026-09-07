(function (root, factory) {
  var api = factory()
  if (typeof module === 'object' && module.exports) {
    module.exports = api
  }
  root.DisplayModeControl = api
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var STATUS_PATH = 'environment.displayMode'
  var CONTROL_PATH = 'environment.displayMode.control'
  var STATUS_URL = '/signalk/v1/api/vessels/self/environment/displayMode/value'
  var CONTROL_URL = '/signalk/v1/api/vessels/self/environment/displayMode/control'

  function clampBacklight (value) {
    var n = typeof value === 'string' ? parseInt(value, 10) : Number(value)
    if (!isFinite(n)) {
      return null
    }
    n = Math.round(n)
    if (n < 1 || n > 10) {
      return null
    }
    return n
  }

  function normalizeMode (mode) {
    if (mode === 'day' || mode === 'night') {
      return mode
    }
    return null
  }

  function normalizeGroup (group) {
    if (group == null || group === '') {
      return null
    }
    var asString = String(group)
    if (asString === 'Default' || /^[1-6]$/.test(asString)) {
      return asString
    }
    return null
  }

  function parseStatus (value) {
    if (value == null) {
      return { mode: null, backlight: null }
    }
    if (typeof value !== 'object') {
      return { mode: null, backlight: clampBacklight(value) }
    }
    return {
      mode: normalizeMode(value.mode),
      backlight: clampBacklight(value.backlight)
    }
  }

  function buildControlValue (mode, backlight, group) {
    var value = {
      mode: normalizeMode(mode) || 'day',
      backlight: clampBacklight(backlight)
    }
    if (value.backlight == null) {
      value.backlight = 5
    }
    var normalizedGroup = normalizeGroup(group)
    if (normalizedGroup) {
      value.group = normalizedGroup
    }
    return value
  }

  function buildPutBody (mode, backlight, group) {
    return { value: buildControlValue(mode, backlight, group) }
  }

  return {
    STATUS_PATH: STATUS_PATH,
    CONTROL_PATH: CONTROL_PATH,
    STATUS_URL: STATUS_URL,
    CONTROL_URL: CONTROL_URL,
    clampBacklight: clampBacklight,
    normalizeMode: normalizeMode,
    normalizeGroup: normalizeGroup,
    parseStatus: parseStatus,
    buildControlValue: buildControlValue,
    buildPutBody: buildPutBody
  }
}))
