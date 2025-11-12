'use client';

import { useState, useEffect } from 'react';
import { apiService, handleApiError } from '@/services/api';
import { Inbox, Send as SendIcon, Mail, MailOpen, Trash2, Reply, X } from 'lucide-react';

interface Message {
  id: number;
  from_user_id: number;
  to_user_id: number;
  subject: string;
  body: string;
  is_read: boolean;
  created_at: string;
  from_name?: string;
  to_name?: string;
  from_email?: string;
  to_email?: string;
  from_role?: string;
  to_role?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  
  // Compose form
  const [recipients, setRecipients] = useState<User[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
    fetchRecipients();
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = activeTab === 'inbox'
        ? await apiService.messages.getInbox()
        : await apiService.messages.getSent();
      setMessages(response.data.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipients = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Fetch appropriate recipients based on role
      if (user.role === 'student') {
        // Students can message teachers
        const response = await apiService.teachers.getAll();
        setRecipients(response.data.data.map((t: any) => ({
          id: t.user_id,
          name: t.full_name,
          email: t.email,
          role: 'teacher'
        })));
      } else if (user.role === 'teacher') {
        // Teachers can message students and admin
        const studentsRes = await apiService.students.getAll();
        const students = studentsRes.data.data.map((s: any) => ({
          id: s.user_id,
          name: s.full_name,
          email: s.email,
          role: 'student'
        }));
        setRecipients(students);
      }
    } catch (err) {
      console.error('Failed to fetch recipients:', err);
    }
  };

  const handleSelectMessage = async (message: Message) => {
    setSelectedMessage(message);
    
    // Mark as read if it's an inbox message
    if (activeTab === 'inbox' && !message.is_read) {
      try {
        await apiService.messages.markAsRead(message.id);
        fetchMessages(); // Refresh to update read status
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    }
  };

  const handleDelete = async (messageId: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await apiService.messages.delete(messageId);
      setSelectedMessage(null);
      fetchMessages();
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  const handleReply = (message: Message) => {
    setReplyTo(message);
    setShowCompose(true);
    setSelectedRecipient(message.from_user_id.toString());
    setSubject(`Re: ${message.subject}`);
    setBody(`\n\n--- Original Message ---\nFrom: ${message.from_name}\nDate: ${new Date(message.created_at).toLocaleString()}\n\n${message.body}`);
  };

  const handleSend = async () => {
    if (!selectedRecipient || !subject.trim() || !body.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSending(true);
      await apiService.messages.send({
        toUserId: parseInt(selectedRecipient),
        subject: subject.trim(),
        body: body.trim(),
        parentMessageId: replyTo?.id || null,
      });
      alert('Message sent successfully!');
      setShowCompose(false);
      setReplyTo(null);
      setSelectedRecipient('');
      setSubject('');
      setBody('');
      if (activeTab === 'sent') {
        fetchMessages();
      }
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setSending(false);
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
            <p className="text-gray-600">Communicate with teachers and students</p>
          </div>
          <button
            onClick={() => {
              setShowCompose(true);
              setReplyTo(null);
              setSubject('');
              setBody('');
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
          >
            <SendIcon className="h-5 w-5 mr-2" />
            Compose
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => {
                  setActiveTab('inbox');
                  setSelectedMessage(null);
                }}
                className={`flex-1 px-4 py-3 font-medium flex items-center justify-center ${
                  activeTab === 'inbox'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Inbox className="h-5 w-5 mr-2" />
                Inbox
                {unreadCount > 0 && activeTab === 'inbox' && (
                  <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab('sent');
                  setSelectedMessage(null);
                }}
                className={`flex-1 px-4 py-3 font-medium flex items-center justify-center ${
                  activeTab === 'sent'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <SendIcon className="h-5 w-5 mr-2" />
                Sent
              </button>
            </div>

            {/* Messages */}
            <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No messages</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => handleSelectMessage(message)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                      selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                    } ${!message.is_read && activeTab === 'inbox' ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center">
                        {!message.is_read && activeTab === 'inbox' ? (
                          <Mail className="h-4 w-4 text-blue-600 mr-2" />
                        ) : (
                          <MailOpen className="h-4 w-4 text-gray-400 mr-2" />
                        )}
                        <span className={`font-medium ${!message.is_read && activeTab === 'inbox' ? 'text-gray-900' : 'text-gray-700'}`}>
                          {activeTab === 'inbox' ? message.from_name : message.to_name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm mb-1 ${!message.is_read && activeTab === 'inbox' ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                      {message.subject}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {message.body}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
            {selectedMessage ? (
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex space-x-2">
                      {activeTab === 'inbox' && (
                        <button
                          onClick={() => handleReply(selectedMessage)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Reply"
                        >
                          <Reply className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(selectedMessage.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">
                      {activeTab === 'inbox' ? 'From:' : 'To:'}
                    </span>
                    <span>
                      {activeTab === 'inbox' ? selectedMessage.from_name : selectedMessage.to_name}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-gray-900">
                      {selectedMessage.body}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a message to read</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {replyTo ? 'Reply to Message' : 'Compose Message'}
              </h3>
              <button
                onClick={() => {
                  setShowCompose(false);
                  setReplyTo(null);
                  setSelectedRecipient('');
                  setSubject('');
                  setBody('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To *
                </label>
                <select
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  disabled={!!replyTo}
                >
                  <option value="">Select recipient...</option>
                  {recipients.map((recipient) => (
                    <option key={recipient.id} value={recipient.id}>
                      {recipient.name} ({recipient.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Enter subject..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 h-64"
                  placeholder="Type your message..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowCompose(false);
                    setReplyTo(null);
                    setSelectedRecipient('');
                    setSubject('');
                    setBody('');
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={sending}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  disabled={sending}
                >
                  <SendIcon className="h-5 w-5 mr-2" />
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
