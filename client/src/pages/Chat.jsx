import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getConversations,
  getConversation,
  sendMessage,
  markConversationRead,
  deleteMessage,
  getUser
} from '../services/api';
import toast from 'react-hot-toast';

const Chat = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Conversations list state
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

  // Active chat state
  const [activeFriend, setActiveFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Mobile view toggle
  const [showChat, setShowChat] = useState(!!friendId);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const pollRef = useRef(null);

  // Load conversations list
  const loadConversations = useCallback(async () => {
    try {
      const res = await getConversations();
      setConversations(res.data || []);
    } catch {
      // silent fail on poll
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  // Load a specific conversation
  const loadMessages = useCallback(async (fId) => {
    if (!fId) return;
    setLoadingMessages(true);
    try {
      const res = await getConversation(fId);
      setMessages(res.data.messages || []);
      markConversationRead(fId).catch(() => {});
      // Update unread count in conversations list
      setConversations(prev =>
        prev.map(c =>
          c.friend._id === fId ? { ...c, unreadCount: 0 } : c
        )
      );
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Resolve friend info when opening a chat
  const resolveFriend = useCallback(async (fId) => {
    // Check conversations list first
    const existing = conversations.find(c => c.friend._id === fId);
    if (existing) {
      setActiveFriend(existing.friend);
      return;
    }
    // Fallback: fetch user profile
    try {
      const res = await getUser(fId);
      setActiveFriend(res.data);
    } catch {
      setActiveFriend({ _id: fId, username: 'User' });
    }
  }, [conversations]);

  // Initial load
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // When friendId changes (URL param)
  useEffect(() => {
    if (friendId) {
      setShowChat(true);
      resolveFriend(friendId);
      loadMessages(friendId);
    } else {
      setShowChat(false);
      setActiveFriend(null);
      setMessages([]);
    }
  }, [friendId, resolveFriend, loadMessages]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      loadConversations();
      if (friendId) loadMessages(friendId);
    }, 5000);
    return () => clearInterval(pollRef.current);
  }, [friendId, loadConversations, loadMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectConversation = (fId) => {
    navigate(`/messages/${fId}`);
  };

  const handleBack = () => {
    navigate('/messages');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !friendId) return;
    if (newMessage.length > 1000) {
      toast.error('Message too long (max 1000 characters)');
      return;
    }
    setSending(true);
    try {
      const res = await sendMessage({ recipientId: friendId, content: newMessage.trim() });
      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
      textareaRef.current?.focus();
      // Update conversations list with new last message
      setConversations(prev => {
        const updated = prev.map(c =>
          c.friend._id === friendId
            ? { ...c, lastMessage: res.data }
            : c
        );
        // Sort so this conversation moves to top
        updated.sort((a, b) => {
          const ta = a.lastMessage ? new Date(a.lastMessage.createdAt) : 0;
          const tb = b.lastMessage ? new Date(b.lastMessage.createdAt) : 0;
          return tb - ta;
        });
        return updated;
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await deleteMessage(messageId);
      setMessages(prev => prev.filter(m => m._id !== messageId));
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete message');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const oneDay = 86400000;
    if (diff < oneDay && date.getDate() === now.getDate()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diff < oneDay * 2) return 'Yesterday';
    if (diff < oneDay * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const Avatar = ({ userObj, size = 'md' }) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base'
    };
    if (userObj?.avatar) {
      return (
        <img
          src={userObj.avatar}
          alt={userObj.username}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-[var(--border-primary)]`}
        />
      );
    }
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-semibold flex-shrink-0`}>
        {userObj?.username?.charAt(0).toUpperCase() || '?'}
      </div>
    );
  };

  // ── Conversations Sidebar ──────────────────────────────
  const ConversationsList = () => (
    <div className={`${friendId && showChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 md:min-w-[320px] md:max-w-[320px] border-r border-[var(--border-primary)] bg-[var(--bg-elevated)] h-full`}>
      {/* Sidebar header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-primary)]">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Messages</h2>
        <Link
          to="/friends"
          className="text-xs font-medium text-[var(--color-primary)] hover:underline"
        >
          Find Friends
        </Link>
      </div>

      {/* Search / filter placeholder */}
      <div className="px-4 py-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--color-primary)]"
            // Search filtering could be added later
          />
        </div>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {loadingConversations ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner w-6 h-6"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12 px-4">
            <svg className="w-12 h-12 mx-auto mb-3 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm text-[var(--text-secondary)] mb-1">No conversations yet</p>
            <Link to="/friends" className="text-sm text-[var(--color-primary)] hover:underline">
              Add friends to start chatting
            </Link>
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = friendId === conv.friend._id;
            const preview = conv.lastMessage
              ? (conv.lastMessage.sender?.username === user?.username ? 'You: ' : '') + conv.lastMessage.content
              : 'No messages yet';

            return (
              <button
                key={conv.friend._id}
                onClick={() => selectConversation(conv.friend._id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--bg-tertiary)] ${
                  isActive ? 'bg-[var(--bg-tertiary)]' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar userObj={conv.friend} size="lg" />
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-[var(--color-error)] text-white text-[10px] font-bold rounded-full px-1">
                      {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-semibold truncate ${conv.unreadCount > 0 ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
                      {conv.friend.username}
                    </span>
                    <span className="text-[11px] text-[var(--text-tertiary)] flex-shrink-0">
                      {formatTime(conv.lastMessage?.createdAt)}
                    </span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${conv.unreadCount > 0 ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-tertiary)]'}`}>
                    {preview.length > 50 ? preview.slice(0, 50) + '...' : preview}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  // ── Active Chat Panel ──────────────────────────────────
  const ChatPanel = () => {
    if (!friendId) {
      return (
        <div className="hidden md:flex flex-1 items-center justify-center bg-[var(--bg-primary)]">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-1">Select a conversation</h3>
            <p className="text-sm text-[var(--text-tertiary)]">Choose a friend to start chatting</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`${!showChat ? 'hidden md:flex' : 'flex'} flex-col flex-1 bg-[var(--bg-primary)] h-full min-w-0`}>
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] flex-shrink-0">
          <button
            onClick={handleBack}
            className="md:hidden p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {activeFriend && (
            <Link to={`/profile/${activeFriend._id}`} className="flex items-center gap-3 min-w-0">
              <Avatar userObj={activeFriend} size="md" />
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[var(--text-primary)] truncate">
                  {activeFriend.username}
                </h3>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {messages.length} message{messages.length !== 1 ? 's' : ''}
                </p>
              </div>
            </Link>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="spinner w-6 h-6"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-3 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm text-[var(--text-secondary)] mb-1">No messages yet</p>
                <p className="text-xs text-[var(--text-tertiary)]">Say hello!</p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-1">
              {messages.map((msg, idx) => {
                const isOwn = msg.sender._id === user?._id;
                const prevMsg = messages[idx - 1];
                const sameSender = prevMsg && prevMsg.sender._id === msg.sender._id;
                const showDateSep = idx === 0 || !isSameDay(new Date(prevMsg.createdAt), new Date(msg.createdAt));

                return (
                  <div key={msg._id}>
                    {showDateSep && (
                      <div className="flex items-center justify-center my-4">
                        <span className="text-[11px] text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-3 py-1 rounded-full">
                          {formatDateSeparator(msg.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${sameSender && !showDateSep ? 'mt-0.5' : 'mt-3'}`}>
                      {/* Other user's avatar */}
                      {!isOwn && (
                        <div className="w-8 mr-2 flex-shrink-0">
                          {(!sameSender || showDateSep) ? (
                            <Avatar userObj={msg.sender} size="sm" />
                          ) : null}
                        </div>
                      )}

                      <div className={`group flex items-center gap-1 max-w-[75%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                        <div
                          className={`px-3 py-2 text-sm break-words whitespace-pre-wrap ${
                            isOwn
                              ? 'bg-[var(--color-primary)] text-white rounded-2xl rounded-tr-md'
                              : 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-2xl rounded-tl-md'
                          }`}
                        >
                          {msg.content}
                        </div>

                        {/* Time + delete */}
                        <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0`}>
                          <span className="text-[10px] text-[var(--text-tertiary)]">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isOwn && (
                            <button
                              onClick={() => handleDelete(msg._id)}
                              className="p-0.5 rounded hover:bg-[var(--color-error)] hover:text-white text-[var(--text-tertiary)] transition-colors"
                              title="Delete"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message input */}
        <div className="bg-[var(--bg-elevated)] border-t border-[var(--border-primary)] px-4 py-3 flex-shrink-0">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="w-full px-3 py-2 text-sm bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] resize-none"
                rows="1"
                maxLength="1000"
                disabled={sending}
                style={{ minHeight: '38px', maxHeight: '120px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
              />
            </div>
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="p-2 rounded-xl bg-[var(--color-primary)] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-primary-dark)] transition-colors flex-shrink-0"
            >
              {sending ? (
                <div className="spinner w-5 h-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <div className="text-center">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">Sign in to chat</h2>
          <Link to="/login" className="text-sm text-[var(--color-primary)] hover:underline">Log in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex overflow-hidden bg-[var(--bg-primary)]">
      <ConversationsList />
      <ChatPanel />
    </div>
  );
};

// Helpers
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function formatDateSeparator(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  if (isSameDay(date, now)) return 'Today';
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(date, yesterday)) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

export default Chat;
