#!/usr/bin/env node
const assert = require("assert");
const vhf = require("../public/vhf");

const blob = {
  id: "lock-near",
  name: "Near lock",
  type: "lock",
  channel: "22",
  callname: "Lock",
  distance: -12,
  vhfdata: { generic: { mode: "announce" } },
};

assert.deepStrictEqual(vhf.parseVhfValue(null).kind, "empty");
assert.equal(vhf.parseVhfValue(JSON.stringify(blob)).kind, "blob");
assert.equal(vhf.parseVhfValue(JSON.stringify(blob)).vhf.channel, "22");
assert.equal(vhf.parseVhfValue(blob).kind, "blob");

const compact = { id: "lock-near", distance: -12, bearing: Math.PI / 2 };
assert.equal(vhf.parseVhfValue(compact).kind, "compact");
const hydrated = vhf.hydrateCompact(compact, { "lock-near": blob });
assert.equal(hydrated.channel, "22");
assert.equal(hydrated.distance, -12);
assert.equal(hydrated.type, "lock");

const vts = {
  id: "vts-1",
  type: "vts",
  name: "VTS",
  channel: "14",
  distance: 800,
  vhfdata: { generic: { mode: "listen" } },
};
const picked = vhf.pickFromList([blob, vts], {
  path: "vhfdata.nearest.vts",
  key: "VTS",
});
assert.equal(picked.id, "vts-1");
assert.equal(
  vhf.pickFromList([blob, vts], { path: "vhfdata.nearest.lock" }).id,
  "lock-near",
);
assert.equal(
  vhf.pickFromList([vts, blob], { path: "vhfinfo.nearby", key: "POI" }).type,
  "lock",
);

assert.ok(vhf.vhfKeyLabel(blob).indexOf("INSIDE") !== -1);
assert.ok(vhf.vhfKeyLabel(vts).indexOf("800m") !== -1);
assert.equal(vhf.vhfDisplayName(blob), "Lock");

console.log("vhf display parse: ok");
