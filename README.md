# Dislay B&G style instrument data on a wide screen

Plugin for the instrument part, specifically to mimic brand look (B&G now, but relatively easy to adapt and configure (CSS) for others).
Supports config with multiple displays and pages/layouts.
E.g. you can make a config for mobile, ipad and waveshare like ultra wide screen.

### Features
 - Menu to choose display (or use url parameter &display=<name>)
 - Slide left/right to switch pages (or use url parameter &page=>nr>
 - Slide up to return to menu.
 - Long press on any box to enable/disable settingMode (or use url parameter &settingsMode=true)
 - Click left or right on any box in settingsMode to cycle through sources
 - Turn swiping off with `?swipe=off` as url parameter
 - Load an url (like Freeboard) in a box
 - Switch to a certain page depending on navigation.state (anchored, moored, sailing, motoring)
 - Show [VHF info data](https://www.npmjs.com/package/vhfinfo)

Example:
```
http://localhost:3000/signalk-instrument-display-plugin/?display=mobile&page=1&settingsMode=true
```

### To do
 - Load layouts options from file list in public/layouts/
 - Deal with stale updates

![screenshot](https://github.com/htool/signalk-instrument-display-plugin/blob/main/doc/widescreen_animated.gif)
