var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_TOKEN}).base(process.env.AIRTABLE_BASE_ID);
import { getSession } from './_session.js';
const shopitems = require("./shopitems.json");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const session = getSession(req);
  if (!session) { return res.status(401).json({ error: "not logged in" }); }
  const { category, id, hours } = req.body;

  try {
    console.log(id);

    var record = await base(process.env.AIRTABLE_SHOP).create(
    [{
      "fields": {
        "Item": shopitems[category][id][0],
        "Cost": shopitems[category][id][5],
        "Email": session.email
      }
    }])
    console.log(record[0].getId());
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
  // return res.status(200).json({ status: "ok", email: session.email, category: category, id: id });
  return res.status(200).json({"cool": "ok"});
}
