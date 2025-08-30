"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MessageSquare, 
  Search, 
  Send, 
  Phone, 
  Video,
  MoreVertical,
  ArrowLeft,
  Clock,
  Check,
  CheckCheck
} from "lucide-react"

interface Message {
  id: number
  patientId: number
  patientNom: string
  patientPrenom: string
  contenu: string
  timestamp: string
  lu: boolean
  type: 'recu' | 'envoye'
  avatar?: string
}

interface Conversation {
  patientId: number
  patientNom: string
  patientPrenom: string
  dernierMessage: string
  timestamp: string
  nonLus: number
  avatar?: string
}

const mockMessages: Message[] = [
  {
    id: 1,
    patientId: 1,
    patientNom: "Dupont",
    patientPrenom: "Marie",
    contenu: "Bonjour Docteur, j'aimerais reporter mon rendez-vous de demain si possible.",
    timestamp: "2024-01-15T10:30:00",
    lu: false,
    type: "recu"
  },
  {
    id: 2,
    patientId: 1,
    patientNom: "Dupont",
    patientPrenom: "Marie",
    contenu: "Bien sûr, nous pouvons le reporter. Quelles sont vos disponibilités ?",
    timestamp: "2024-01-15T10:35:00",
    lu: true,
    type: "envoye"
  },
  {
    id: 3,
    patientId: 2,
    patientNom: "Martin",
    patientPrenom: "Jean",
    contenu: "Merci pour la consultation d'hier. Les médicaments prescrits fonctionnent bien.",
    timestamp: "2024-01-15T09:15:00",
    lu: false,
    type: "recu"
  },
  {
    id: 4,
    patientId: 3,
    patientNom: "Bernard",
    patientPrenom: "Sophie",
    contenu: "Bonjour, j'ai quelques questions concernant les résultats de mes analyses.",
    timestamp: "2024-01-15T08:45:00",
    lu: false,
    type: "recu"
  }
]

const mockConversations: Conversation[] = [
  {
    patientId: 1,
    patientNom: "Dupont",
    patientPrenom: "Marie",
    dernierMessage: "Bien sûr, nous pouvons le reporter. Quelles sont vos disponibilités ?",
    timestamp: "2024-01-15T10:35:00",
    nonLus: 1
  },
  {
    patientId: 2,
    patientNom: "Martin",
    patientPrenom: "Jean",
    dernierMessage: "Merci pour la consultation d'hier. Les médicaments prescrits fonctionnent bien.",
    timestamp: "2024-01-15T09:15:00",
    nonLus: 1
  },
  {
    patientId: 3,
    patientNom: "Bernard",
    patientPrenom: "Sophie",
    dernierMessage: "Bonjour, j'ai quelques questions concernant les résultats de mes analyses.",
    timestamp: "2024-01-15T08:45:00",
    nonLus: 1
  }
]

export default function MessagesPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Protection de route
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const filteredConversations = conversations.filter(conv => 
    conv.patientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.patientPrenom.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedMessages = selectedConversation 
    ? messages.filter(msg => msg.patientId === selectedConversation)
    : []

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const newMsg: Message = {
        id: messages.length + 1,
        patientId: selectedConversation,
        patientNom: "",
        patientPrenom: "",
        contenu: newMessage,
        timestamp: new Date().toISOString(),
        lu: true,
        type: "envoye"
      }
      setMessages([...messages, newMsg])
      setNewMessage("")
    }
  }

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.nonLus, 0)

  return (
    // <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center space-x-3">
                <MessageSquare className="w-8 h-8 text-emerald-600" />
                <span>Messages</span>
                {totalUnread > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {totalUnread}
                  </Badge>
                )}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Communiquez avec vos patients
              </p>
            </div>
          </div>
        </div>

        {/* Messages Interface */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden h-[600px] flex">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher une conversation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.patientId}
                  onClick={() => setSelectedConversation(conversation.patientId)}
                  className={`p-4 border-b border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                    selectedConversation === conversation.patientId ? 'bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-l-emerald-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {conversation.patientPrenom[0]}{conversation.patientNom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {conversation.patientPrenom} {conversation.patientNom}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-500">
                            {formatTime(conversation.timestamp)}
                          </span>
                          {conversation.nonLus > 0 && (
                            <Badge className="bg-emerald-500 text-white text-xs px-1.5 py-0.5">
                              {conversation.nonLus}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate mt-1">
                        {conversation.dernierMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {conversations.find(c => c.patientId === selectedConversation)?.patientPrenom[0]}
                        {conversations.find(c => c.patientId === selectedConversation)?.patientNom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {conversations.find(c => c.patientId === selectedConversation)?.patientPrenom} {conversations.find(c => c.patientId === selectedConversation)?.patientNom}
                      </h3>
                      <p className="text-sm text-slate-500">En ligne</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'envoye' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.type === 'envoye' 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                      }`}>
                        <p className="text-sm">{message.contenu}</p>
                        <div className={`flex items-center justify-end space-x-1 mt-1 ${
                          message.type === 'envoye' ? 'text-emerald-100' : 'text-slate-500'
                        }`}>
                          <span className="text-xs">{formatTime(message.timestamp)}</span>
                          {message.type === 'envoye' && (
                            message.lu ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Sélectionnez une conversation
                  </h3>
                  <p className="text-slate-500 dark:text-slate-500">
                    Choisissez un patient pour commencer à discuter
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}