import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server'

export async function POST(request) {
//req: NextApiRequest, res: NextApiResponse, resolvedUrl) {
  console.log("request=", request)
  //console.log("req=", req, "res=", res, "resolvedUrl=", resolvedUrl)
  return NextResponse.json({ good: 'All good' }, { status: 200 })
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  if (req.method === 'POST') {
    const event = req.body.event; // Extract event data
    // Handle the event
    console.log('Received event:', event);
    // Perform necessary actions based on the event
    //res.status(200).json({ message: 'Webhook received successfully' });
    res.setHeader("Content-Type", "application/json");
    res.write('{\"market\": \"x\", \"prices\": 10}');
    res.end();
    return {
      props: {},
    }
  } else {
    console.log('Problem');
    if (typeof res != "undefined" && typeof res.status != "undefined") {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  }
}
