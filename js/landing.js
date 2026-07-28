const details = [document.getElementById("node-img"), document.getElementById("node-hsl"), document.getElementById("node-viewer")];
var media_tablet = window.matchMedia("(min-width: 40rem)");

function autoclose_details() {
  document.getElementById("node-viewer").open = true;
  document.getElementById("node-img").open = false;
  document.getElementById("node-hsl").open = media_tablet.matches;
}
media_tablet.addEventListener("change", function() { autoclose_details(); });

autoclose_details();
