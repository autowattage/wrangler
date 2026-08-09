// thanks chatgpt for coding this for me (idfk jackshit)
const emailfield = document.getElementById("flow-mail");
document.getElementById("joinbutton").addEventListener("click", async () => {
  const response = await fetch("/api/add-to-airtable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: emailfield.value
    })
  });

  const result = await response.json();

  if (response.ok) {
    console.log("Added to Airtable!");
  } else {
    console.log(result);
  }
});
