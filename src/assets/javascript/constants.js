import * as d3 from "d3";

export const TITLE =
  "Practice Locations of Washington University Otolaryngology Graduates";
export const SUBTITLE =
  "Interactive map: Hover over circles for more information";
export const OVERSIGHT_DISCLAIMER =
  "We apologize for any oversight.  Please communicate suggestions to ENTresidency@wustl.edu.";

export const LEGEND_TITLE_TOP = "Graduates Per City";
export const LEGEND_TITLE_BOTTOM = "Academic Status";

export const TOOLTIP_COLORS = {
  1: { color: "#e41a1c", title: "Fellow" },
  2: { color: "#377eb8", title: "Instructor" },
  3: { color: "#4daf4a", title: "Assistant Professor" },
  4: { color: "#984ea3", title: "Associate Professor" },
  5: { color: "#ff7f00", title: "Professor" },
};

export const NO_ZIPCODE = ({ firstName, lastName, zipcode }) => {
  // Log that we could not find zipcode for this person
  console.warn(`${firstName} ${lastName} not found.  Zip Code (${zipcode})`);
};

export const RADIUS = (n) => Math.sqrt(n) * 10;

export const COLOR = d3
  .scaleOrdinal()
  .range(Object.keys(TOOLTIP_COLORS).map((v) => TOOLTIP_COLORS[v].color));

export const RANKS = {
  UNRANKED: 'unranked',
  FELLOW: 'fellow',
  INSTRUCTOR: 'instructor',
  ASSISTANT_PROFESSOR: 'assistant professor',
  ASSOCIATE_PROFESSOR: 'associate professor',
  PROFESSOR: 'professor'
}