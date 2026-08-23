const params = new URLSearchParams(window.location.search);
const code = params.get("code");
var stats = document.getElementById("stats");

// logged into hack club auth
if (code) {
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
  }).catch (error => {
    console.log(`im a token fetch error! ${error}`);
  })
}


const shopbuttons = document.getElementsByClassName("shopbutton");
const popup = document.getElementById("confirm-popup");
const purchase = popup.firstElementChild.lastElementChild.lastElementChild.lastElementChild;
const exit = popup.firstElementChild.firstElementChild.lastElementChild;
var category;
var id;
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
  console.log(`bought ${category} ${id}`);
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
});
