import React, { useState } from 'react';
import Sidebar from '../../components/SidebarTourGuide';
import { FiMessageSquare, FiSearch, FiPaperclip, FiMic, FiSmile, FiChevronDown } from 'react-icons/fi';

const Chat = () => {
  // Sample chat data
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'John D. Silva',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      lastMessage: 'Thanks for the upgrade! The room is amazing.',
      time: '10:30 AM',
      unread: 2,
      messages: [
        { id: 1, sender: 'them', text: 'Hi there! I wanted to ask about room upgrades', time: '10:15 AM' },
        { id: 2, sender: 'them', text: "We're celebrating our anniversary", time: '10:16 AM' },
        { id: 3, sender: 'me', text: 'Happy anniversary! We have a deluxe suite available', time: '10:25 AM' },
        { id: 4, sender: 'them', text: 'Thanks for the upgrade! The room is amazing.', time: '10:30 AM' },
      ]
    },
    {
      id: 2,
      name: 'Alice M. Smith',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      lastMessage: 'Is breakfast included in our package?',
      time: '9:45 AM',
      unread: 0,
      messages: [
        { id: 1, sender: 'them', text: 'Good morning!', time: '9:30 AM' },
        { id: 2, sender: 'me', text: 'Good morning Alice! How can I help?', time: '9:35 AM' },
        { id: 3, sender: 'them', text: 'Is breakfast included in our package?', time: '9:45 AM' },
      ]
    },
    {
      id: 3,
      name: 'Robert K. Lee',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      lastMessage: 'The AC in room 302 seems to be not working',
      time: 'Yesterday',
      unread: 3,
      messages: [
        { id: 1, sender: 'them', text: 'Hello, I have an issue with my room', time: 'Yesterday' },
        { id: 2, sender: 'them', text: 'The AC in room 302 seems to be not working', time: 'Yesterday' },
      ]
    }
  ]);

  const [activeConversation, setActiveConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              id: conv.messages.length + 1,
              sender: 'me',
              text: newMessage,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ],
          lastMessage: newMessage,
          time: 'Just now',
          unread: 0
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setNewMessage('');
  };

  const activeChat = conversations.find(conv => conv.id === activeConversation);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 flex">
        {/* Contacts sidebar */}
        <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-slate-800">Messages</h2>
            <div className="relative mt-3">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${activeConversation === conversation.id ? 'bg-blue-50' : ''}`}
                onClick={() => {
                  setActiveConversation(conversation.id);
                  // Mark as read when selected
                  if (conversation.unread > 0) {
                    const updated = conversations.map(c => 
                      c.id === conversation.id ? {...c, unread: 0} : c
                    );
                    setConversations(updated);
                  }
                }}
              >
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-slate-800 truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-500">{conversation.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <span className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {conversation.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeChat ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h3 className="font-medium text-slate-800">{activeChat.name}</h3>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <FiSearch className="text-gray-500" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <FiChevronDown className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-3">
                  {activeChat.messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'}`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center">
                  <button className="p-2 rounded-full hover:bg-gray-100 mr-2">
                    <FiPaperclip className="text-gray-500" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 mr-2">
                    <FiSmile className="text-gray-500" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <FiMessageSquare />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <FiMessageSquare className="mx-auto text-4xl text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-700">Select a conversation</h3>
                <p className="text-gray-500">Choose from your existing messages</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;