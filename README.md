### Overview
This tool is an interactive map showing where alumni of WashU’s Otolaryngology Residency Training program between 1990 and 2017 currently practice. Alumni are grouped by city - those in nearby cities are in a tooltip, ordered by graduation date. Those with an academic rank are indicated by a color to the left of their name in the tooltip.

### Libraries used:
* Tooltips are produced using the [tippy.js](https://atomiks.github.io/tippyjs/) plugin
* General map, bubbles, and visualization produced with [d3.js](https://d3js.org/) visualization library
* Mapping zip code to nearest city is through [turf.js](https://turfjs.org/) geospatial analysis library
