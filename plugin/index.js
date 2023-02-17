const url = require('url');

var plugin = {}

module.exports = function(app, options) {
  "use strict"
  var plugin = {}
  plugin.id = "signalk-instrument-display-plugin"
  plugin.name = "Configurable instrument display"
  plugin.description = "Signal K webapp that allows displays setups to mimic brand G style instruments."

  var unsubscribes = []
  var schema = {
    type: "object",
    properties: {
      style: {
        enum: ['BandG', 'Raymarine'],
        title: 'Instrument style'
      },
      sources: {
        type: "array",
        title: "Sources",
        description: "List the sources and their configuration to be used. Sources can be listed multiple times for different configurations.",
        items: {
          type: "object",
          properties: {
            displayType: {
              enum: ['number', 'string', 'navigationArrow', 'url', 'vhf'],
              title: 'Display type',
              description: 'Identifier for display type.',
              default: 'number'
            },
            key: {
              type: 'string',
              title: 'Data key. For vhf can be POI or VTS',
              default: 'SOG'
            },
            path: {
              type: 'string',
              title: 'Source path',
              default: 'navigation.speedOverGround'
            },
            unit: {
              type: 'string',
              title: 'Unit (e.g. kn, mBar, m/s, ℃, ℉, °M, °T)',
              default: 'kn'
            },
            decimals: {
              type: 'integer',
              title: 'Decimals',
              default: 1
            },
            url: {
              type: 'string',
              title: 'URL to use for e.g. url types',
              default: ''
            }
          }
        }
      },
      displays: {
        type: "array",
        title: "Displays",
        description: "For each display you can add a configuration.",
        items: {
          properties: {
            name: {
              type: 'string',
              title: 'Display name',
              description: 'Add your displays with their own configuration',
              default: 'mobile'
            },
            pages: {
              type: "array",
              title: "Pages on this device.",
              items: {
                properties: {
                  layout: {
	                  enum: ['1', '2+1_2+1','2','4_2+1','4', '4_4','waveshare_3x2+1+1x2', 'waveshare_4x2+1x2'],
	                  title: 'Pages',
	                  description: "Configure the layout(s) for the page(s) for your display."
	                },
                  context: {
                    enum: ['anchored', 'moored', 'sailing', 'motoring'],
                    title: 'Active on this navigation.state',
                    descripting: 'You can make a page active depending on a navigation.state.'
                  },
	                sources: {
	                  type: "array",
	                  title: "Sources",
	                  items: {
                      properties: {
	                      source: {
                          type: 'number',
                          title: 'Source number for the boxes in the layout.',
                          default: 1
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  plugin.schema = function() {
    return schema
  }

  plugin.start = function(options, restartPlugin) {
    app.debug('starting plugin')
    app.debug("Options: " + JSON.stringify(options))
    
    plugin.registerWithRouter = function(router) {
	  // Will appear here; plugins/signalk-instrument-display-plugin/
	    app.debug("registerWithRouter")
	    router.get("/options", (req, res) => {
	      res.contentType("application/json")
	      res.send(JSON.stringify(options))
	    })
	    router.post("/saveOptions", (req, res) => {
	      res.contentType("application/json")
        writeOptions(req.body);
        res.sendStatus(200);
	    })
	  }

    function writeOptions (newoptions) {
      try {
        options = newoptions
        app.savePluginOptions(options, () => {app.debug('Plugin options saved')});
        // restartPlugin(options)
      } catch (err) {
        console.error(err)
      }
    }

  }

  plugin.stop = function() {
    app.debug("Stopping")
    unsubscribes.forEach(f => f())
    // keyPaths.length = keyPaths.length - 1
    app.debug("Stopped")
  }

  return plugin;
};
module.exports.app = "app"
module.exports.options = "options"
