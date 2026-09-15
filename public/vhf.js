/* Parse vhfinfo deltas: JSON blobs, compact {id,distance,bearing}, or a nearby list. */
;(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.vhfDisplay = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  var POI_TYPES = {
    lock: true,
    bridge: true,
    marina: true,
  };

  function lastPathPart(path) {
    var parts = String(path || "").split(".");
    return parts[parts.length - 1] || "";
  }

  function isCompactHit(obj) {
    return (
      obj &&
      typeof obj === "object" &&
      !Array.isArray(obj) &&
      obj.id != null &&
      String(obj.id) !== "" &&
      Object.prototype.hasOwnProperty.call(obj, "distance") &&
      !obj.type &&
      !obj.channel &&
      !obj.vhfdata
    );
  }

  function parseVhfValue(value) {
    if (value == null || value === "") {
      return { kind: "empty" };
    }
    var obj = value;
    if (typeof value === "string") {
      var text = value.trim();
      if (text === "" || text === "-" || text === "null") {
        return { kind: "empty" };
      }
      try {
        obj = JSON.parse(text);
      } catch (e) {
        return { kind: "empty" };
      }
    }
    if (Array.isArray(obj)) {
      return { kind: "list", hits: obj };
    }
    if (isCompactHit(obj)) {
      return { kind: "compact", hit: obj };
    }
    if (obj && typeof obj === "object" && (obj.type || obj.channel || obj.name)) {
      return { kind: "blob", vhf: obj };
    }
    return { kind: "empty" };
  }

  function regionToBlob(region) {
    if (!region || typeof region !== "object") {
      return {};
    }
    var props = (region.feature && region.feature.properties) || region;
    return {
      id: region.id || props.id,
      name: region.name || props.name,
      callname: props.callname,
      type: props.type,
      channel: props.channel,
      phone: props.phone,
      url: props.url,
      vhfdata: props.vhfdata,
    };
  }

  function hydrateCompact(hit, catalog) {
    if (!hit || hit.id == null) {
      return null;
    }
    var extra = (catalog && catalog[String(hit.id)]) || {};
    var blob = extra.feature ? regionToBlob(extra) : Object.assign({}, extra);
    blob.id = String(hit.id);
    blob.distance = hit.distance;
    if (Object.prototype.hasOwnProperty.call(hit, "bearing")) {
      blob.bearing = hit.bearing;
    }
    return blob;
  }

  function typeMatchesSlot(type, slot) {
    var t = String(type || "").toLowerCase();
    var s = String(slot || "").toLowerCase();
    if (s === "vtsradar" || s === "vts radar support") {
      return t === "vtsradar" || t === "vts radar support";
    }
    return t === s;
  }

  function isPoiType(type) {
    return POI_TYPES[String(type || "").toLowerCase()] === true;
  }

  function pickFromList(items, box) {
    var list = items || [];
    if (!list.length) {
      return null;
    }
    var slot = lastPathPart(box && box.path);
    var key = String((box && box.key) || "").toLowerCase();
    var index = parseInt(slot, 10);
    if (String(index) === slot && index >= 0) {
      return list[index] || null;
    }
    var i;
    if (slot && slot !== "nearby") {
      for (i = 0; i < list.length; i++) {
        if (typeMatchesSlot(list[i] && list[i].type, slot)) {
          return list[i];
        }
      }
    }
    if (key === "vts") {
      for (i = 0; i < list.length; i++) {
        if (typeMatchesSlot(list[i] && list[i].type, "vts")) {
          return list[i];
        }
      }
    }
    if (key === "poi") {
      for (i = 0; i < list.length; i++) {
        if (isPoiType(list[i] && list[i].type)) {
          return list[i];
        }
      }
    }
    return list[0];
  }

  function vhfMode(vhf) {
    return (
      (vhf &&
        vhf.vhfdata &&
        vhf.vhfdata.generic &&
        vhf.vhfdata.generic.mode) ||
      ""
    );
  }

  function vhfKeyLabel(vhf) {
    if (!vhf) {
      return "";
    }
    var type = String(vhf.type || "").toUpperCase();
    if (type === "TERRITORIAL") {
      type = "12Nm zone";
    }
    var mode = String(vhfMode(vhf)).toUpperCase();
    var distance = Number(vhf.distance);
    if (distance > 0) {
      var prefix = mode ? mode + " &#8227; " : "";
      return prefix + type + " &#8227; " + Math.round(distance) + "m";
    }
    if (distance < 0) {
      return type + (mode ? "  INSIDE  " + mode : "  INSIDE");
    }
    return type;
  }

  function vhfDisplayName(vhf) {
    if (!vhf) {
      return "";
    }
    if (vhf.callname) {
      return String(vhf.callname);
    }
    return String(vhf.name || "");
  }

  return {
    parseVhfValue: parseVhfValue,
    hydrateCompact: hydrateCompact,
    regionToBlob: regionToBlob,
    pickFromList: pickFromList,
    vhfKeyLabel: vhfKeyLabel,
    vhfDisplayName: vhfDisplayName,
    isPoiType: isPoiType,
  };
});
