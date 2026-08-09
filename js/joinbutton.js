// thanks chatgpt for coding this for me (idfk jackshit)
const emailfield = document.getElementById("flow-mail");
document.getElementById("joinbutton").addEventListener("click", async () => {
  const response = await fetch("/api/add-to-airtable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: emailfield.value;
    })
  });

  const result = await response.json();

  if (response.ok) {
    console.log("Added to Airtable!");
  } else {
    console.log(result);
  }
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email } = req.body;

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fields: {
            Name: name,
            Email: email
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Airtable request failed"
      });
    }

    return res.status(200).json({
      success: true,
      record: data
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server error"
    });
  }
}
