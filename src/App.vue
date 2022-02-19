<template>
  <div id="map"></div>
</template>

<script>
import * as d3 from "d3";
import { featureCollection, point } from "@turf/helpers";
import { default as nearestPoint } from "@turf/nearest-point";
import { default as distance } from "@turf/distance";
import {
  TOOLTIP_COLORS,
  TITLE,
  SUBTITLE,
  LEGEND_TITLE_BOTTOM,
  OVERSIGHT_DISCLAIMER,
  LEGEND_TITLE_TOP,
  NO_ZIPCODE,
} from "./assets/javascript/constants";
import { createTooltip } from "./helpers/createTooltip";
import json from "./assets/json/us-states.json";
import zips from "./assets/json/us_zip_codes_SMALL.json";
import { large, washU } from "./assets/javascript/largeCities.js";
import { small } from "./assets/javascript/smallCities.js";
import { graduates } from "./assets/javascript/graduates.js";
import tippy from "tippy.js";

var width = 810;
var height = 310;

var radius = (n) => Math.sqrt(n) * 10;

// D3 Projection
var projection = d3
  .geoAlbersUsa()
  .translate([width / 2, height - 50]) // translate to position on screen
  .scale([1000]); // scale things down so see entire US

// Define path generator
var path = d3.geoPath().projection(projection); // tell path generator to use albersUsa projection

export default {
  name: "Alumni-map",
  methods: {
    createMap() {
      let svg = d3
        .select("#map")
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .append("svg")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + " 900 " + " 550")
        //class to make it responsive
        .classed("svg-content-responsive", true);

      svg
        .selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "#e1e8e4")
        .style("stroke", "#fff")
        .style("stroke-width", "1");

      var large_collect = featureCollection(large);
      var small_collect = featureCollection(small);

      // Make object out of zip codes so we dont have to iterate over them again and agin
      const zip_obj = zips.reduce((a, i) => {
        i.ZipCode = i["Zip Code"];
        a[i.ZipCode] = i;
        return a;
      }, {});

      let grads = graduates
        .filter((person) =>
          zip_obj[person.zipcode] ? true : NO_ZIPCODE(person)
        ) // only those w found-zipcodes proceed
        .map((person) => {
          const { ZipCode, Latitude, Longitude } = zip_obj[person.zipcode];
          //set "city" for Washington University manually:
          if (ZipCode == 63110) {
            var info = washU.geometry.coordinates;
          } else {
            var hometown = point([Longitude, Latitude]);
            var large_result = nearestPoint(hometown, large_collect);

            // Look to list of smaller cities if closest large city is more than 100km away
            // (dont want to bin with a city that's too far away)
            if (distance(hometown, large_result) > 100) {
              var small_result = nearestPoint(hometown, small_collect);
              info = small_result.geometry.coordinates;
            } else {
              info = large_result.geometry.coordinates;
            }
          }
          person.lat = info[1];
          person.lon = info[0];
          person.city = info[2].city;
          person.state = info[2].state;
          return person;
        });

      let groupedGrads = d3.group(grads, (d) => d.city + ", " + d.state);
      let count = {};
      groupedGrads.forEach((grouped, name) => (count[name] = grouped.length));

      svg
        .selectAll("circle")
        .data(groupedGrads)
        .enter()
        .append("circle")
        //cx and cy to map each circle to correct place on screen
        .attr("cx", ([, [{ lat, lon }]]) => projection([lon, lat])[0])
        .attr("cy", ([, [{ lat, lon }]]) => projection([lon, lat])[1])
        .attr("class", "tooltip bubble")
        .attr("data-tippy-content", createTooltip)
        .attr("r", ([name]) => radius(count[name]));

      var l_WidthCenter = width / 2 + 370;

      var titleContainer = svg
        .append("g")
        .attr(
          "transform",
          "translate(" + (width / 2 - 250) + "," + (height - 270) + ")"
        );

      titleContainer.append("text").attr("class", "title").text(TITLE);

      titleContainer
        .append("text")
        .attr("class", "subtitle")
        .attr("transform", "translate(" + 120 + "," + 20 + ")")
        .text(SUBTITLE);

      svg
        .append("g")
        .attr("class", "disclaimer")
        .attr(
          "transform",
          "translate(" + (l_WidthCenter + 75) + "," + (height + 225) + ")"
        )
        .append("text")
        .text(OVERSIGHT_DISCLAIMER);

      svg
        .append("g")
        .attr(
          "transform",
          "translate(" + l_WidthCenter + "," + (height - 50) + ")"
        )
        .append("text")
        .attr("class", "legend title")
        .text(LEGEND_TITLE_TOP);

      var legend = svg
        .append("g")
        .attr("class", "legend")
        .attr(
          "transform",
          "translate(" + l_WidthCenter + "," + (height + 40) + ")"
        )
        .selectAll("g")
        .data([1, 5, 15])
        .enter()
        .append("g");

      legend
        .append("circle")
        .attr("cy", (d) => -radius(d))
        .attr("r", radius);

      legend
        .append("text")
        .attr("y", (d) => -2 * radius(d))
        .attr("dy", "1.3em")
        .text((d) => d);

      svg
        .append("g")
        .attr(
          "transform",
          "translate(" + l_WidthCenter + "," + (height + 75) + ")"
        )
        .append("text")
        .attr("class", "legend title")
        .text(LEGEND_TITLE_BOTTOM);

      var color = d3
        .scaleOrdinal()
        .range(Object.keys(TOOLTIP_COLORS).map((v) => TOOLTIP_COLORS[v].color));

      // var r = 74,
      //   p = 10;

      var legend2 = svg
        .append("g")
        .attr("class", "legend2")
        .attr(
          "transform",
          "translate(" + (l_WidthCenter - 35) + "," + (height + 85) + ")"
        )
        .selectAll("g")
        .data(color.range().slice().reverse())
        .enter()
        .append("g")
        .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

      legend2
        .append("circle")
        .attr("cy", 7)
        .attr("r", 7)
        .attr("class", "legend rects")
        .style("fill", color);

      legend2
        .append("text")
        .attr("x", 12)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text((d, i) => TOOLTIP_COLORS[Object.keys(TOOLTIP_COLORS)[i]].title);
    },
  },
  mounted() {
    this.createMap();

    tippy(".tooltip", {
      delay: 0,
      duration: 0,
      arrow: true,
      theme: "light",
      allowHTML: true,
    });
  },
};
</script>

<style>
@import "./assets/css/index.css";
@import "~tippy.js/dist/tippy.css";
@import "~tippy.js/themes/light.css";
@import "./assets/css/tippy.css";
</style>
