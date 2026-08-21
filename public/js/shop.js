const params = new URLSearchParams(window.location.search);
const code = params.get("code");
var stats = document.getElementById("stats");

// logged into hack club auth
if (code) {
  console.log("yipper i got a code");
  stats.style.display = "flex";

  // get/validate token
  fetch("/api/token", {
    method: "POST",
    body: JSON.stringify({code: code}),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  }).then(response => {
    return response.json().then(data => {
      if (!response.ok) {
        console.log(`token exchange failed with:`, data);
        throw new Error(`HTTP error with status: ${response.status}`);
      }
      return data;
    });
  }).then(data => {
    // successful email get. Stats update time
    console.log(data);

  }).catch (error => {
    console.log(`im a token fetch error! ${error}`);
  })
}


const shopbuttons = document.getElementsByClassName("shopbutton");
const popup = document.getElementById("confirm-popup");
const purchase = popup.firstElementChild.lastElementChild.lastElementChild.lastElementChild;
const exit = popup.firstElementChild.firstElementChild.lastElementChild;

// shop button display
for (const button of shopbuttons) {
  button.addEventListener("click", (event) => {
    category = button.getAttribute("data-item-category");
    id = button.getAttribute("data-item-id");

    popup.style.display = "flex";
    document.getElementById("popup-0").textContent = shopitems[category][id][0];
    document.getElementById("popup-1").textContent = shopitems[category][id][1];
    document.getElementById("popup-23").src = shopitems[category][id][2];
    document.getElementById("popup-23").alt = shopitems[category][id][3];
    if (shopitems[category][id][4][0]) {
      document.getElementById("popup-4").style.display = "inline-block";
    } else {
      document.getElementById("popup-4").style.display = "none";
    }
    document.getElementById("popup-5").textContent = `-\xa0\xa0\xa0\xa0${shopitems[category][id][5]} ${shopitems[category][id][5] === 1 ? 'hour\xa0\xa0' : 'hours'}`;
    // console.log(shopitems[category][id]);
  });
}

// clicking ouside box
popup.addEventListener("click", (event) => { if (!event.target.closest('details')) { popup.style.display = "none";} });
// another exit button
exit.addEventListener("click", (event) => { popup.style.display = "none"; });

// purchase button
purchase.addEventListener("click", (event) => {
  console.log("bought");
});
