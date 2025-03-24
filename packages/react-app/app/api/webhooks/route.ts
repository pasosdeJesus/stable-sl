import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto';

export async function POST(request: NextRequest) {
  console.log("")
  console.log("---------------------------------")
  console.log("request.headers=", request.headers)
  console.log("request.headers['x-signature']=", request.headers.get('x-signature'))
  console.log("process.env.FONBNK_SECRET",process.env.FONBNK_SECRET)

  if (typeof process.env.FONBNK_SECRET == "undefined" ||
      process.env.FONBNK_SECRET == "") {
    return NextResponse.json(
      { error: 'Incomplete configuration of Webhook' },
      { status: 400}
    )
  }
  if (request.headers.get('x-signature') == null) {
    return NextResponse.json(
      { error: 'This webhook expects connections from FonBnk Webhook V2' },
      { status: 400}
    )
  }

  //console.log("request=", request)
  //console.log("request.cookies=", request.cookies)

/*  if (!(request.header['x-signature'] === createHash('sha256')
    .update(JSON.stringify(request.body))
    .update(
      createHash('sha256').update(process.env.FONBNK_SECRET, 'utf8')
      .digest('hex')
    ).digest('hex')) {

  } */



  try {
    //const text = await request.text()
    const requestJson = await request.json()
    console.log("request.json()=", requestJson)
    // Process the webhook payload

    return NextResponse.json({ good: 'All good' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400})
  }

  //const searchParams = request.nextUrl.searchParams
  //return NextResponse.json({ good: 'All good' }, { status: 200 })
  // console.log('Problem');
  // return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405})
}
