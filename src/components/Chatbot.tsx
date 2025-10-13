import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, User, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface FAQ {
  keywords: string[]
  patterns?: RegExp[]
  response: string | ((match?: string) => string)
  priority?: number
}

const faqs: FAQ[] = [
  // High priority - exact service matches
  {
    keywords: ['rapidseal', 'rapid seal', 'balcony waterproofing'],
    patterns: [/rapid\s*seal/i, /balcon(y|ies)\s*(waterproof|seal)/i],
    priority: 10,
    response:
      "RapidSeal™ is our proprietary balcony waterproofing system that's 3x faster and 50% cheaper than traditional methods. It includes a 10-step process with warranty up to 15 years: subject to terms and conditions. Would you like to learn more?",
  },
  {
    keywords: ['caulking', 'sealing', 'joint', 'silicon'],
    patterns: [/caulk(ing)?/i, /seal(ing|ant)?/i, /expansion\s*joint/i],
    priority: 10,
    response:
      'We offer professional caulking solutions for balconies, windows, façades, and expansion joints. Our work prevents water ingress, improves energy efficiency, and enhances aesthetics.',
  },
  {
    keywords: ['bathroom', 'shower', 'wet area'],
    patterns: [/(bathroom|shower)\s*(waterproof|leak)/i],
    priority: 10,
    response:
      'We specialize in bathroom and shower waterproofing, ensuring your wet areas are completely protected. Our services include full membrane systems, compliant with Australian standards.',
  },
  {
    keywords: ['planter box', 'garden bed', 'planter'],
    patterns: [/planter\s*box/i],
    priority: 10,
    response:
      'Our planter box waterproofing prevents water damage to buildings while maintaining beautiful gardens. We use specialized membranes and drainage systems for long-lasting protection.',
  },
  {
    keywords: ['roof deck', 'podium', 'rooftop'],
    patterns: [/(roof|rooftop)\s*(deck|podium)/i],
    priority: 10,
    response:
      'We provide comprehensive roof deck and podium waterproofing for commercial and residential properties, including pedestrian traffic areas and landscaped rooftops.',
  },
  {
    keywords: ['leak detection', 'find leak', 'water leak'],
    patterns: [/(leak|water)\s*detect/i, /find.*leak/i],
    priority: 9,
    response:
      'Our leak detection service uses advanced techniques to identify the source of water ingress. We provide detailed reports with photos and recommended solutions. Book a free inspection!',
  },
  
  // Medium priority - pricing and quotes
  {
    keywords: ['cost', 'price', 'how much', 'quote', 'estimate'],
    patterns: [/how\s*much/i, /what.*cost/i, /price|pricing/i],
    priority: 7,
    response:
      "Our pricing varies based on project size and scope. RapidSeal™ typically costs about half of traditional methods. Contact us for a free quote tailored to your specific needs!",
  },
  
  // Timing questions
  {
    keywords: ['time', 'how long', 'duration', 'quick', 'fast'],
    patterns: [/how\s*(long|quick)/i, /time.*take/i, /duration/i],
    priority: 7,
    response:
      'RapidSeal™ projects typically complete in ⅓ the time of traditional methods. Most balcony projects are done within 1-2 days, minimising disruption to residents.',
  },
  
  // Warranty and guarantees
  {
    keywords: ['warranty', 'guarantee', 'insurance', 'cover'],
    patterns: [/warrant(y|ies)/i, /guarantee/i],
    priority: 7,
    response:
      'We provide warranty up to 15 years: subject to terms and conditions on all RapidSeal™ installations, and our work complies with AS 4654.2:2012, AS 3740:2021, and NCC standards.',
  },
  
  // Booking and appointments
  {
    keywords: ['booking', 'book', 'appointment', 'inspection', 'schedule', 'visit'],
    patterns: [/book(ing)?/i, /schedule|appointment/i, /inspection/i],
    priority: 8,
    response:
      "You can book a free inspection using our calendar booking system or by calling 03 9001 7788. We'll schedule a site visit at your convenience!",
  },
  
  // Location and service area
  {
    keywords: ['location', 'where', 'area', 'melbourne', 'victoria', 'service area'],
    patterns: [/where.*service/i, /service.*area/i, /do.*work/i],
    priority: 6,
    response:
      'We service all of Melbourne Metro and regional Victoria. Whether you\'re in the CBD or suburbs, our team can help. Call us to confirm we service your area: 03 9001 7788',
  },
  
  // Commercial vs residential
  {
    keywords: ['commercial', 'business', 'strata', 'body corporate'],
    patterns: [/commercial|business/i, /strata|body\s*corporate/i],
    priority: 6,
    response:
      'We specialize in both commercial and residential waterproofing. Our commercial clients include schools, hospitals, government buildings, and strata complexes. We handle projects of all sizes.',
  },
  
  // Emergency and urgent
  {
    keywords: ['emergency', 'urgent', 'asap', 'right now', 'immediately'],
    patterns: [/emergency|urgent|asap/i, /right\s*now|immediately/i],
    priority: 10,
    response:
      'For urgent waterproofing issues, please call us immediately at 03 9001 7788. We prioritize emergency leak repairs and can often provide same-day service for critical situations.',
  },
  
  // Maintenance plans
  {
    keywords: ['maintenance', 'plan', 'preventative', 'regular service'],
    patterns: [/maintenance\s*plan/i, /prevent(ative|ion)/i],
    priority: 6,
    response:
      'Our preventative maintenance plans help avoid costly repairs. We offer regular inspections and maintenance schedules for commercial properties, strata buildings, and large residential complexes.',
  },
  
  // Greetings
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    patterns: [/^(hi|hello|hey|g'?day)/i],
    priority: 5,
    response:
      "G'day! Welcome to Advance Waterproofing. I'm here to help you with waterproofing solutions. What would you like to know about?",
  },
  
  // Thanks
  {
    keywords: ['thanks', 'thank you', 'cheers'],
    patterns: [/thanks|thank\s*you|cheers/i],
    priority: 5,
    response:
      "You're welcome! If you have any more questions about our waterproofing services, feel free to ask. Or book a free inspection to get started!",
  },
]

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "G'day! I'm here to help with your waterproofing questions. Ask me about RapidSeal™, caulking services, pricing, or booking an inspection!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    service: '',
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const findResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim()
    
    // Handle talk to human requests first
    if (lowerMessage.includes('human') || lowerMessage.includes('talk to') || 
        lowerMessage.includes('speak to someone') || lowerMessage.includes('call me')) {
      setShowLeadForm(true)
      return "I'd be happy to connect you with our team! Please fill in your details below and we'll get back to you shortly."
    }

    // Score-based matching for better accuracy
    let bestMatch: FAQ | null = null
    let bestScore = 0

    for (const faq of faqs) {
      let score = 0
      
      // Check regex patterns first (more accurate)
      if (faq.patterns) {
        for (const pattern of faq.patterns) {
          if (pattern.test(userMessage)) {
            score += 15 * (faq.priority || 5)
          }
        }
      }
      
      // Check keywords
      for (const keyword of faq.keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          // Give more points for exact word matches
          const wordBoundary = new RegExp(`\\b${keyword.toLowerCase()}\\b`)
          score += wordBoundary.test(lowerMessage) ? 10 : 5
          score *= (faq.priority || 5)
        }
      }
      
      if (score > bestScore) {
        bestScore = score
        bestMatch = faq
      }
    }

    // Return best match if score is high enough
    if (bestMatch && bestScore > 20) {
      return typeof bestMatch.response === 'function' 
        ? bestMatch.response() 
        : bestMatch.response
    }

    // Default response with contextual help
    const hasQuestion = lowerMessage.includes('?')
    if (hasQuestion) {
      return "That's a great question! For specific inquiries, I recommend booking a free inspection or calling us at 03 9001 7788. You can also ask me about our services, pricing, warranties, or booking process."
    }

    return "Thanks for reaching out! I can help you with information about our waterproofing services, pricing, warranties, and bookings. What would you like to know?"
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: findResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 500)
  }

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Lead submitted:', leadData)

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: `Thank you, ${leadData.name}! We've received your details and will contact you shortly at ${leadData.email}. One of our specialists will reach out within 24 hours.`,
        sender: 'bot',
        timestamp: new Date(),
      },
    ])

    setShowLeadForm(false)
    setLeadData({ name: '', email: '', phone: '', location: '', service: '' })
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
          size="icon"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 left-0 sm:bottom-6 sm:right-6 sm:left-auto w-full sm:w-96 h-[100dvh] sm:h-[600px] bg-background border sm:rounded-lg shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-3 sm:p-4 sm:rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Advance Waterproofing</h3>
                <p className="text-xs opacity-90">Usually replies instantly</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-muted/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-2',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[75%] rounded-lg p-3',
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border'
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {/* Lead Form */}
            {showLeadForm && (
              <div className="bg-background border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Get in Touch</h4>
                <form onSubmit={handleLeadSubmit} className="space-y-2">
                  <Input
                    placeholder="Your Name"
                    value={leadData.name}
                    onChange={(e) =>
                      setLeadData({ ...leadData, name: e.target.value })
                    }
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={leadData.email}
                    onChange={(e) =>
                      setLeadData({ ...leadData, email: e.target.value })
                    }
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={leadData.phone}
                    onChange={(e) =>
                      setLeadData({ ...leadData, phone: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Location (Suburb/City)"
                    value={leadData.location}
                    onChange={(e) =>
                      setLeadData({ ...leadData, location: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Service Needed"
                    value={leadData.service}
                    onChange={(e) =>
                      setLeadData({ ...leadData, service: e.target.value })
                    }
                  />
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </form>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="text-sm sm:text-base"
              />
              <Button onClick={handleSend} size="icon" className="flex-shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Or call us: <a href="tel:+61390017788" className="hover:underline">03 9001 7788</a>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
