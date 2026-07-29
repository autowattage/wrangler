const menu = document.getElementById("menu");
const list = menu.getElementsByTagName("ul")[0]
menu.firstElementChild.firstElementChild.firstElementChild.addEventListener("click", function() {
  console.log("clicked");
  list.style.display == "none" ? list.style.display = "flex" : list.style.display = "none";
});
