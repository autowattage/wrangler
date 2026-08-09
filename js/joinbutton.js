const emailfield = document.getElementById("flow-mail");

document.getElementById("joinbutton").addEventListener("click", async () => {
  try {
    const response = await fetch("/api/add-to-airtable", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: emailfield.value
      })
    });

    const text = await response.text();

    console.log("HTTP status:", response.status);
    console.log("Server response:", text);

    if (response.ok) {
      console.log("Added to Airtable!");
    } else {
      console.error("Request failed:", text);
    }
  } catch (error) {
    console.error("Fetch failed:", error);
  }
});

