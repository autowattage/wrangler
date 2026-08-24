const params = new URLSearchParams(window.location.search);
const code = params.get("code");
var stats = document.getElementById("stats");
const shopbuttons = document.getElementsByClassName("shopbutton");
const popup = document.getElementById("confirm-popup");
const purchase = popup.firstElementChild.lastElementChild.lastElementChild.lastElementChild;
const exit = popup.firstElementChild.firstElementChild.lastElementChild;
var category;
var id;

function show_popup(event) {
  category = event.target.getAttribute("data-item-category");
  id = event.target.getAttribute("data-item-id");

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
  document.getElementById("popup_hours").textContent = '\xa0\xa0\xa0\xa0' + document.getElementById("stats-total").textContent + ' hour' + (Number(document.getElementById("stats-total").textContent) === 1 ? "\xa0\xa0" : "s");
  document.getElementById("popup_remaining").textContent = Number(document.getElementById("stats-total").textContent) - shopitems[category][id][5] + ' hour' + ((Number(document.getElementById("stats-total").textContent) - shopitems[category][id][5]) === 1 ? "\xa0\xa0" : "s");
  document.getElementById("submit").value = `Purchase for ${shopitems[category][id][5]} ${shopitems[category][id][5] === 1 ? 'hour\xa0\xa0' : 'hours'}`;
}

async function getstats() {
  stats.style.display = "flex";

  // get stats
  fetch("/api/getstats", {
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
    history.replaceState(null, "", window.location.pathname);
    document.getElementById("stats-acc").textContent = data["Accepted hours"];
    document.getElementById("stats-pend").textContent = data["Pending hours"];
    document.getElementById("stats-add").textContent = data["Manual hours added"];
    document.getElementById("stats-total").textContent = data["Shop hours"];
    document.getElementById("stats-spent").textContent = data["Spent hours"];
    for (const button of shopbuttons) {
      category = button.getAttribute("data-item-category");
      id = button.getAttribute("data-item-id");
      // if (shopitems)
      if (shopitems[category][id][5] > data["Shop hours"]) {
        button.style.backgroundColor = "var(--black)";
        button.style.color = "var(--light-gray)";
        button.style.cursor = "auto";
        button.removeEventListener("click", show_popup);
      }
    }
  }).catch (error => {
    console.log(`im a token fetch error! ${error}`);
  })
}
// logged into hack club auth
if (code) { getstats(); }

// shop button display
if (code) {
  for (const button of shopbuttons) { button.addEventListener("click", show_popup); }
} else {
  for (const button of shopbuttons) { button.onclick = function () { location.href="https://auth.hackclub.com/oauth/authorize?client_id=21c885509412e982827ce79b44cb1904&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fshop%2F&response_type=code&scope=openid+email+verification_status"; }}
}
// clicking ouside box
popup.addEventListener("click", (event) => { if (!event.target.closest('details')) { popup.style.display = "none";} });
// another exit button
exit.addEventListener("click", (event) => { popup.style.display = "none"; });

// purchase button
purchase.addEventListener("click", (event) => {
  // add to shop queue
  fetch("/api/purchaseitem", {
    method: "POST",
    body: JSON.stringify({category: category, id: id}),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  }).then(response => {
    return response.json().then(data => {
      if (!response.ok) {
        console.log(`purchase failed with:`, data);
        throw new Error(`HTTP error with status: ${response.status}`);
      }
      return data;
    });
  }).then(data => {
    console.log(`yay ${JSON.stringify(data)}`);
  }).catch (error => {
    console.log(`im a purchase error! ${error}`);
  })
  // update shop stats
  confetti({
    position: { x: event.clientX, y: event.clientY },
    count: 200,
    size: 1,
    velocity: 150,
    fade: true
  });
  popup.style.display = "none";
  document.getElementById("stats-total").textContent = Number(document.getElementById("stats-total").textContent) - shopitems[category][id][5];
  document.getElementById("stats-spent").textContent = Number(document.getElementById("stats-spent").textContent) + shopitems[category][id][5];
  for (const button of shopbuttons) {
    category = button.getAttribute("data-item-category");
    id = button.getAttribute("data-item-id");
    if (shopitems[category][id][5] > Number(document.getElementById("stats-total").textContent)) {
      button.style.backgroundColor = "var(--black)";
      button.style.color = "var(--light-gray)";
      button.style.cursor = "auto";
      button.removeEventListener("click", show_popup);
    }
  }
  console.log(`bought ${category} ${id}`);
});
