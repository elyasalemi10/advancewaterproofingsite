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

const faqs = [
  {
    keywords: ['cost', 'price', 'how much'],
    response:
      "Our pricing varies based on project size and scope. RapidSeal™ typically costs about half of traditional methods. Contact us for a free quote tailored to your specific needs!",
  },
  {
    keywords: ['rapidseal', 'rapid seal', 'system'],
    response:
      "RapidSeal™ is our proprietary balcony waterproofing system that's 3x faster and 50% cheaper than traditional methods. It includes a 10-step process with warranty up to 15 years: subject to terms and conditions. Would you like to learn more?",
  },
  {
    keywords: ['caulking', 'sealing', 'joint'],
    response:
      'We offer professional caulking solutions for balconies, windows, façades, and expansion joints. Our work prevents water ingress, improves energy efficiency, and enhances aesthetics.',
  },
  {
    keywords: ['time', 'how long', 'duration'],
    response:
      'RapidSeal™ projects typically complete in ⅓ the time of traditional methods. Most balcony projects are done within 1-2 days, minimising disruption to residents.',
  },
  {
    keywords: ['warranty', 'guarantee'],
    response:
      'We provide warranty up to 15 years: subject to terms and conditions on all RapidSeal™ installations, and our work complies with AS 4654.2:2012, AS 3740:2021, and NCC standards.',
  },
  {
    keywords: ['booking', 'book', 'appointment', 'inspection'],
    response:
      "You can book a free inspection using our calendar booking system or by calling 03 9001 7788. We'll schedule a site visit at your convenience!",
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
    const lowerMessage = userMessage.toLowerCase()

    for (const faq of faqs) {
      if (faq.keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return faq.response
      }
    }

    if (lowerMessage.includes('human') || lowerMessage.includes('talk to')) {
      setShowLeadForm(true)
      return "I'd be happy to connect you with our team! Please fill in your details below and we'll get back to you shortly."
    }

    return "Thanks for your question! For specific inquiries, I recommend booking a free inspection or calling us at 03 9001 7788. How else can I help you today?"
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
