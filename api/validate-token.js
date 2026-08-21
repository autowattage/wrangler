export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const { code } = req.body;

  try {
    // validate token
    const response = await fetch(
      "https://auth.hackclub.com/oauth/discovery/keys"
    );
    
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}

// //exchange for toknes
// fetch("https://auth.hackclub.com/oauth/token", {
//   method: "POST",
//   body: JSON.stringify({
//     "client_id": `${process.env.HACKCLUB_CLIENT_ID}`,
//     "client_secret": `${process.env.HACKCLUB_SECRET_ID}`,
//     "redirect_uri": "http://localhost:3000/shop/",
//     "code": code,
//     "grant_type": "authorization_code"
//   }),
//   headers: {
//     "Content-type": "application/json; charset=UTF-8"
//   }
// }).then(response => {
//   if (!response.ok) {
//     console.log("response not okay!");
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//   return response.json();
// }).then(data => {
//   console.log(data);
// }).catch (error => {
//   console.log("fetch error!");
// })
// }
