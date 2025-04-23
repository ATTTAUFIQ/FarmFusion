import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import api from '../utils/api';
import { FaPaperPlane, FaShare } from 'react-icons/fa6';

type ForumMessage = {
  _id: string;
  text: string;
  senderDetail: { name: string; email: string };
  when: string;
};

const Community = () => {
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const messageEndRef = useRef<null | HTMLDivElement>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/forum-messages', {
        params: {
          limit: '20',
          page: page.toString(),
        },
      });

      setMessages(data.data);
      setHasNext(data.hasNext);
    } catch (error) {
      console.error('Error fetching messages', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await api.post('/forum-messages', {
        text,
      });
      setText('');
      fetchMessages(); // Re-fetch messages after sending one
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-5 m-5 border rounded-lg">
      {/* Header */}
      <header className="bg-green-500 text-white p-4 text-center font-semibold">
        Community Forum
      </header>

      {/* Chat Messages */}
      <div className="flex-grow overflow-auto p-4">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message._id} className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl">{message.senderDetail.name[0]}</span>
                </div>
                <div className="ml-3">
                  <div className="bg-gray-100 p-3 rounded-lg max-w-xs">
                    <p>{message.text}</p>
                  </div>
                  <span className="text-xs text-gray-500">{message.when}</span>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="flex p-4 bg-white border-t border-gray-300">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow p-2 border rounded-lg"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="ml-2 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
        >
          <FaPaperPlane/>
        </button>
      </form>

      {/* Load More */}
      {hasNext && !loading && (
        <div className="p-4 text-center">
          <button
            onClick={() => setPage(page + 1)}
            className="text-green-500 hover:text-green-700"
          >
            Load More Messages
          </button>
        </div>
      )}
    </div>
  );
};

export default Community;
