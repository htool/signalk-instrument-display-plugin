# Dislay B&G style instrument data on a wide screen

Plugin for the instrument part, specifically to mimic brand look (B&G now, but relatively easy to adapt and configure (CSS) for others).
Supports config with multiple displays and pages/layouts.
E.g. you can make a config for mobile, ipad and waveshare like ultra wide screen.

### Features
 - Menu to choose display (or use url parameter &display=<name>)
 - Slide left/right to switch pages (or use url parameter &page=>nr>
 - Slide up to return to menu.
 - Long press on any box to enable/disable settingMode (or use url parameter &settingsMode=true)
 - Click on any box in settingsMode to cycle through sources

Example:
```
http://localhost:3000/signalk-instrument-display-plugin/?display=mobile&page=1&settingsMode=true
```

### URL
You can load a URL in a box, e.g. Freeboard.

### Swipe off
`?swipe=off` as url parameter to disable swipes.


### To do
 - Switch to a certain page depending on condition (sailing/motoring)
 - Convert value based on unit (e.g. radian to degrees)

![screenshot](https://github.com/htool/signalk-instrument-display-plugin/blob/main/doc/widescreen_animated.gif)
