import Airtable from 'airtable';
import { getSession, setSessionCookie } from './_session.js';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const session = getSession(req);
  const { code } = req.body || {};

  let email;

  try {
    if (session) {
      email = session.email;
    } else if (code) {
      //exchange for toknes
      const tokenfetch = await fetch(
        "https://auth.hackclub.com/oauth/token",
        {
          method: "POST",
          body: new URLSearchParams({
            "client_id": process.env.HACKCLUB_CLIENT_ID,
            "client_secret": process.env.HACKCLUB_CLIENT_SECRET,
            "redirect_uri": process.env.HACKCLUB_REDIRECT_URI || "http://localhost:3000/shop/",
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

      email = userdata.email;
      setSessionCookie(req, res, email);
    } else {
      return res.status(401).json({ error: "not logged in" });
    }

    // ok
    const base = new Airtable({apiKey: process.env.AIRTABLE_TOKEN}).base(process.env.AIRTABLE_BASE_ID);
    // code stolen from my wrangler shop bots lmao
    base('currency').select({
      view: 'Grid view'
    }).firstPage(function(err, records) {
      var curr_record;
      if (err) { console.log(err); return res.status(500).json({error: "airtable error"}); }
      records.forEach(function(record) { if (record.get('Email') == email) { curr_record = record; } });
      if (!curr_record) {
        // add to user list if login
        console.log("there's no record with your name in it");
        base('currency').create([
          { "fields": { "Email": email } }
        ], function(err, records) {
          if (err) {console.error(err); return res.status(500).json({error: "airtable error"});}
          return res.status(200).json(records[0].fields);
        })
      } else {
        return res.status(200).json(curr_record.fields);
      }
    });
  }
  catch (error) {
    return res.status(500).json({error: error.message});
  }
}
