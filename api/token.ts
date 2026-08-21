// notes to self
// starts when code detected in browser
// returns a session cookie for browser to verify themselves as
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const { code } = req.body;

  try {
    //exchange for toknes
    const tokenfetch = await fetch(
      "https://auth.hackclub.com/oauth/token",
      {
        method: "POST",
        // body: JSON.stringify({
        body: new URLSearchParams({
          "client_id": process.env.HACKCLUB_CLIENT_ID,
          "client_secret": process.env.HACKCLUB_CLIENT_SECRET,
          "redirect_uri": "http://localhost:3000/shop/",
          "code": code,
          "grant_type": "authorization_code"
        }),
        headers: { "Content-type": "application/x-www-form-urlencoded" }
      }
    );
    const tokendata = await tokenfetch.json();
    if (!tokenfetch.ok || !tokendata.access_token) { return res.status(tokenfetch.status).json(tokendata); }

    // validate tokens w/ userinfo
    const userfetch = await fetch("https://auth.hackclub.com/oauth/userinfo",
      { headers: { "Authorization": `Bearer ${tokendata.access_token}` } }
    );
    const userdata = await userfetch.json();
    if (!userfetch.ok ) { return res.status(userfetch.status).json(userdata); }

    // ok, return tokens as variables
    return res.status(200).json(tokendata);
  }
  catch (error) {
    return res.status(500).json({error: error.message});
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
