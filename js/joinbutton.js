const emailfield = document.getElementById("flow-mail");

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

document.getElementById("joinbutton").addEventListener("click", async () => {
  if (validateEmail(emailfield.value)) {
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
        document.getElementById("joinbutton").textContent = "Email sent!";
      } else {
        console.error("Request failed:", text);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
      document.getElementById("joinbutton").textContent = "Error, try again?";
    }
  } else {
    document.getElementById("joinbutton").textContent = "invalid email :(";
  }
});

