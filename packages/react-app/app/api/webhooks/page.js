export default function handler(req, res) {
  if (req.method === 'POST') {
    const event = req.body.event; // Extract event data
    // Handle the event
    console.log('Received event:', event);
    // Perform necessary actions based on the event
    res.status(200).json({ message: 'Webhook received successfully' });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
