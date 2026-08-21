const emailfield = document.getElementById("flow-mail");
const joinbutton =  document.getElementById("joinbutton");

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

joinbutton.addEventListener("click", async () => {
  joinbutton.textContent = "sending email..";
  if (validateEmail(emailfield.value)) {
    try {
      const response = await fetch("/api/email", {
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
        joinbutton.textContent = "Email sent!";
      } else {
        console.error("Request failed:", text);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
      joinbutton.textContent = "Error, try again?";
    }
  } else {
    joinbutton.textContent = "invalid email :(";
  }
});

