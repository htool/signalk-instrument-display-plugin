# Dislay B&G style instrument data on a wide screen

Plugin for the instrument part, specifically to mimic brand look (B&G now, but relatively easy to adapt and configure (CSS) for others).
Supports config with multiple displays and pages/layouts.
E.g. you can make a config for mobile, ipad and waveshare like ultra wide screen.
Menu to choose display or urlParam.
Slide left/right to switch pages or urlParam.
Slide up to return to menu.
Cycle through sources per box in edit mode (urlParam).

```
http://localhost:3000/signalk-instrument-display-plugin/?display=mobile&page=1&editMode=true
```

### URL
You can load a URL in a box, e.g. Freeboard.

### Swipe off
`?swipe=off` as url parameter to disable swipes.


### To do
 - switch to a certain page depending on condition (sailing/motoring)
 - nicer way to do editting mode

![screenshot](https://github.com/htool/signalk-instrument-display-plugin/blob/main/doc/widescreen_animated.gif)
