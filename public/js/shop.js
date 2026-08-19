const params = new URLSearchParams(window.location.search);
const code = params.get("code");
stats = document.getElementById("stats");
if (code) {
  // console.log("yipper i got a code");
  console.log(stats);
  stats.style.display = "flex";
  // do something with code
}
