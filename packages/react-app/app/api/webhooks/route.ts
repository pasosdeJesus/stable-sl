import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  //console.log("request=", request)
  //console.log("request.cookies=", request.cookies)
  console.log("")
  console.log("---------------------------------")
  console.log("request.headers=", request.headers)

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
