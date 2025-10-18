// Consolidated email API to reduce function count
import sendContact from './send-contact-email.js'
import sendQuote from './send-quote-email.js'

export default async function handler(req, res) {
  const { type } = req.query
  if (type === 'contact') return sendContact(req, res)
  if (type === 'quote') return sendQuote(req, res)
  return res.status(400).json({ error: 'Unsupported email type' })
}


