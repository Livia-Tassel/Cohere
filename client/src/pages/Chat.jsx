import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getConversation,
  sendMessage,
  markConversationRead,
  deleteMessage,
  getFriendshipStatus
} from '../services/api';
import toast from 'react-hot-toast';

const Chat = () => {
  const { friendId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [friend, setFriend] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    loadConversation();
    markConversationRead(friendId);
  }, [friendId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = async () => {
    setLoading(true);
    try {
      const response = await getConversation(friendId);
      setMessages(response.data.messages || []);

      // Get friend info from first message
      if (response.data.messages.length > 0) {
        const firstMessage = response.data.messages[0];
        const friendInfo = firstMessage.sender._id === user.id
          ? firstMessage.recipient
          : firstMessage.sender;
        setFriend(friendInfo);
      } else {
        // If no messages, get friend info from friendship status
        const statusResponse = await getFriendshipStatus(friendId);
        // We'll need to fetch user info separately
        setFriend({ _id: friendId, username: 'Friend' });
      }
    } catch (error) {
      toast.error('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    if (newMessage.length > 1000) {
      toast.error('Message too long (max 1000 characters)');
      return;
    }

    setSending(true);
    try {
      const response = await sendMessage({
        recipientId: friendId,
        content: newMessage.trim()
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
      textareaRef.current?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;

    try {
      await deleteMessage(messageId);
      setMessages(messages.filter(m => m._id !== messageId));
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] bg-[var(--bg-primary)] flex flex-col">
      {/* Chat Header */}
      <div className="bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/friends">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                ← Back
              </motion.button>
            </Link>
            {friend && (
              <Link to={`/profile/${friend._id}`} className="flex items-center gap-3">
                {friend.avatar ? (
                  <img
                    src={friend.avatar}
                    alt={friend.username}
                    className="w-12 h-12 rounded-full border-2 border-[var(--color-primary)]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold">
                    {friend.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="font-bold text-lg text-[var(--text-primary)]">
                    {friend.username}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {messages.length} messages
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-5xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">No messages yet</h3>
              <p className="text-[var(--text-secondary)]">
                Start the conversation by sending a message!
              </p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwn = message.sender._id === user.id;
              const showAvatar = index === 0 || messages[index - 1].sender._id !== message.sender._id;

              return (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {showAvatar ? (
                      message.sender.avatar ? (
                        <img
                          src={message.sender.avatar}
                          alt={message.sender.username}
                          className="w-10 h-10 rounded-full border-2 border-[var(--color-primary)]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-sm">
                          {message.sender.username.charAt(0).toUpperCase()}
                        </div>
                      )
                    ) : (
                      <div className="w-10 h-10"></div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
                    {showAvatar && (
                      <span className="text-xs text-[var(--text-tertiary)] mb-1 px-2">
                        {message.sender.username}
                      </span>
                    )}
                    <div
                      className={`relative group px-4 py-2 rounded-2xl ${
                        isOwn
                          ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white'
                          : 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-primary)]'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>

                      {/* Delete button for own messages */}
                      {isOwn && (
                        <button
                          onClick={() => handleDelete(message._id)}
                          className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-[var(--bg-tertiary)] hover:bg-[var(--color-error)] hover:text-white"
                          title="Delete message"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-[var(--text-tertiary)] mt-1 px-2">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-[var(--bg-elevated)] border-t border-[var(--border-primary)] px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSend} className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message... (Press Enter to send, Shift+Enter for new line)"
                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--glow-primary)] resize-none"
                rows="2"
                maxLength="1000"
                disabled={sending}
              />
              <div className="absolute bottom-2 right-2 text-xs text-[var(--text-tertiary)]">
                {newMessage.length}/1000
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sending ? (
                <>
                  <div className="spinner w-5 h-5 border-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </>
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
