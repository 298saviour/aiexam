'use client';

import { useState, useRef, useEffect } from 'react';
import { Mail, Send, Inbox, Paperclip, X, Search, Plus, Reply, Trash2 } from 'lucide-react';
import apiClient from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TeacherSidebar } from '@/components/dashboard/TeacherSidebar';
import { Modal } from '@/components/ui/Modal';

interface Message {
  id: number;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  attachments?: { name: string; size: number }[];
  type: 'sent' | 'received';
}

/* Removed mock data - now fetching from API
const initialMessages: Message[] = [
  {
    id: 1,
    from: 'Admin',
    to: 'Teacher',
    subject: 'Class Schedule Update',
    body: 'Dear Teacher, Please note the updated class schedule for next week...',
    date: '2024-11-10',
    read: false,
    type: 'received',
  },
  {
    id: 2,
    from: 'Teacher',
    to: 'John Doe (Student)',
    subject: 'Assignment Feedback',
    body: 'Dear John, Your recent assignment shows great improvement...',
    date: '2024-11-08',
    read: true,
    type: 'sent',
  },
  {
    id: 3,
    from: 'Jane Smith (Student)',
    to: 'Teacher',
    subject: 'Question about Exam',
    body: 'Hello Teacher, I have a question regarding the upcoming exam...',
    date: '2024-11-05',
    read: true,
    type: 'received',
  },
];
*/

/* Removed mock data - now fetching from API
const students = [
  { id: 1, name: 'John Doe', class: 'SS3' },
  { id: 2, name: 'Jane Smith', class: 'SS3' },
  { id: 3, name: 'Mike Johnson', class: 'SS2' },
  { id: 4, name: 'Sarah Williams', class: 'SS3' },
  { id: 5, name: 'David Brown', class: 'SS2' },
];
*/

export default function TeacherCommunicationsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedTab, setSelectedTab] = useState<'inbox' | 'sent'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [recipientType, setRecipientType] = useState<'admin' | 'student'>('student');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: '',
    attachments: [] as File[],
  });

  useEffect(() => {
    fetchMessages();
  }, [selectedTab]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/messages/${selectedTab}`);
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await apiClient.get('/users?role=student');
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const handleCompose = () => {
    setComposeData({ to: '', subject: '', body: '', attachments: [] });
    setRecipientType('student');
    setIsComposeOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (files.length !== validFiles.length) {
      alert('Some files exceed 5MB limit and were not added');
    }
    
    setComposeData({ ...composeData, attachments: [...composeData.attachments, ...validFiles] });
  };

  const removeAttachment = (index: number) => {
    const newAttachments = composeData.attachments.filter((_, i) => i !== index);
    setComposeData({ ...composeData, attachments: newAttachments });
  };

  const handleSend = async () => {
    if (!composeData.to || !composeData.subject || !composeData.body) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post('/messages', {
        recipientId: composeData.to,
        subject: composeData.subject,
        body: composeData.body,
        attachments: composeData.attachments.map(f => ({ name: f.name, size: f.size })),
      });

      if (response.data.success) {
        alert('Message sent successfully!');
        setIsComposeOpen(false);
        setComposeData({ to: '', subject: '', body: '', attachments: [] });
        fetchMessages();
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (message: Message) => {
    setComposeData({
      to: message.from,
      subject: `Re: ${message.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${message.from}\nDate: ${message.date}\n\n${message.body}`,
      attachments: [],
    });
    setRecipientType(message.from === 'Admin' ? 'admin' : 'student');
    setIsComposeOpen(true);
    setSelectedMessage(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      setLoading(true);
      await apiClient.delete(`/messages/${id}`);
      setMessages(messages.filter(m => m.id !== id));
      setSelectedMessage(null);
      alert('Message deleted successfully!');
    } catch (error) {
      alert('Failed to delete message');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredMessages = messages
    .filter(m => m.type === selectedTab)
    .filter(m => 
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.to.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <DashboardLayout sidebar={<TeacherSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Communications</h1>
            <p className="text-gray-600 mt-1">Manage correspondence with students and admin</p>
          </div>
          <Button onClick={handleCompose} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Compose Message
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={selectedTab === 'inbox' ? 'primary' : 'outline'}
                      onClick={() => setSelectedTab('inbox')}
                      className="flex-1"
                    >
                      <Inbox className="w-4 h-4 mr-2" />
                      Inbox ({messages.filter(m => m.type === 'received' && !m.read).length})
                    </Button>
                    <Button
                      variant={selectedTab === 'sent' ? 'primary' : 'outline'}
                      onClick={() => setSelectedTab('sent')}
                      className="flex-1"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Sent
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (!message.read && message.type === 'received') {
                          setMessages(messages.map(m => m.id === message.id ? { ...m, read: true } : m));
                        }
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id
                          ? 'bg-blue-50 border-blue-200'
                          : message.read
                          ? 'bg-gray-50 hover:bg-gray-100'
                          : 'bg-white border-2 border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className={`text-sm ${!message.read ? 'font-semibold' : 'font-medium'} text-gray-900 truncate`}>
                          {selectedTab === 'inbox' ? message.from : message.to}
                        </p>
                        <span className="text-xs text-gray-500">{message.date}</span>
                      </div>
                      <p className={`text-sm ${!message.read ? 'font-semibold' : ''} text-gray-700 truncate`}>
                        {message.subject}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-1">{message.body}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <Paperclip className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{message.attachments.length} attachment(s)</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredMessages.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Mail className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>No messages found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{selectedMessage.subject}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span><strong>From:</strong> {selectedMessage.from}</span>
                        <span><strong>To:</strong> {selectedMessage.to}</span>
                        <span><strong>Date:</strong> {selectedMessage.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReply(selectedMessage)}
                      >
                        <Reply className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(selectedMessage.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700">{selectedMessage.body}</p>
                  </div>
                  {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Attachments</h4>
                      <div className="space-y-2">
                        {selectedMessage.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Paperclip className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-900">{file.name}</span>
                              <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                            </div>
                            <Button variant="outline" size="sm">Download</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-20 text-center">
                  <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Message Selected</h3>
                  <p className="text-gray-600">Select a message from the list to view its contents</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Compose Message Modal */}
      <Modal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        title="Compose Message"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Send To *
            </label>
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant={recipientType === 'student' ? 'primary' : 'outline'}
                onClick={() => {
                  setRecipientType('student');
                  setComposeData({ ...composeData, to: '' });
                }}
                className="flex-1"
              >
                Student
              </Button>
              <Button
                type="button"
                variant={recipientType === 'admin' ? 'primary' : 'outline'}
                onClick={() => {
                  setRecipientType('admin');
                  setComposeData({ ...composeData, to: 'Admin' });
                }}
                className="flex-1"
              >
                Admin
              </Button>
            </div>
            {recipientType === 'student' ? (
              <select
                value={composeData.to}
                onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Select a student...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.name}>
                    {student.name} - {student.class}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                type="text"
                value="Admin"
                disabled
                className="bg-gray-100"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <Input
              type="text"
              value={composeData.subject}
              onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
              required
              placeholder="Enter subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              value={composeData.body}
              onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
              required
              rows={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
              placeholder="Type your message here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments (Max 5MB per file)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2"
            >
              <Paperclip className="w-4 h-4" />
              Attach Files
            </Button>
            {composeData.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {composeData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{file.name}</span>
                      <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsComposeOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSend} className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send Message
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
