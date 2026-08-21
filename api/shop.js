export default async function handler(req, res) {
  const { email } = req.body;
  if (req.method == "POST") {
    // try {
    //   const response = await fetch(
    //     `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_CURRENCY}`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Authorization": `Bearer ${process.env.AIRTABLE_TOKEN}`,
    //         "Content-Type": "application/json"
    //       },
    //       body: JSON.stringify({
    //         fields: {
    //           Email: email
    //         }
    //       })
    //     }
    //   );

    //   const data = await response.json();

    //   if (!response.ok) {
    //     return res.status(response.status).json(data);
    //   }

    //   return res.status(200).json(data);
    
    return res.status(200).json({"Get method"});
  } else if (req.method == "GET") {
    return res.status(200).json({"Get method"});

  } else {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }


  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
