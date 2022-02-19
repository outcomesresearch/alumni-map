import { TOOLTIP_COLORS } from "../assets/javascript/constants";

export function createTooltip([name, gradsInThatLocation]) {
  var content = "<strong>" + name + "</strong><br>";
  gradsInThatLocation
    .sort(
      (a, b) => a.finalYearInResidencyProgram - b.finalYearInResidencyProgram
    )
    .forEach((val) => {
      content += "<div>";
      var prof =
        val.academicRank0IfNotRanked1fellow2instructor3asstProf4assocProf5professor;
      if (isNaN(prof) || prof == "") {
        prof = 0;
      } else if (prof > 0) {
        content +=
          '<i class="patch" style="background: ' +
          TOOLTIP_COLORS[prof].color +
          '"></i> ';
      }

      content += `${val.firstName} ${val.lastName} (${val.finalYearInResidencyProgram})`;
      content += `</div>`;
    });
  return content;
}
