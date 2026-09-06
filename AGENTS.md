# Agents

Widescreen B&G-style instrument *layouts* stay in this plugin. Glass brightness does not.

For lighting, read [signalk-n2k-displays](https://github.com/htool/signalk-n2k-displays) `AGENTS.md` and ADR 0001.

## This repo (feature F12)

- Night chrome: keep `environment.mode` (spec).
- CSS brightness filter: read `electrical.displays.brightness` (0–1). Fall back to deprecated `environment.displayMode.backlight` (1–10) until consumers migrate.
- Do not emit N2K. Do not implement lighting policy here.
