import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function FarmingChat() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    setMessages([{ role: 'assistant', text: t.chatIntro, timestamp: new Date() }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const getInitialMessages = () => [
    { role: 'assistant', text: t.chatIntro, timestamp: new Date() },
  ];

  const handleSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: 'user', text, timestamp: new Date() }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: language === 'hi'
            ? 'आपके प्रश्न के लिए धन्यवाद। यह एक डेमो है। वास्तविक उत्तर के लिए AI बैकएंड से कनेक्ट करें।'
            : "Thanks for your question. This is a demo. Connect to an AI backend for real answers.",
          timestamp: new Date(),
        },
      ]);
      setLoading(false);
    }, 800);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setMessages((m) => [
      ...m,
      { role: 'user', text: '', timestamp: new Date(), image: url },
    ]);
    e.target.value = '';
  };

  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setInput((prev) => prev + (language === 'hi' ? ' (आवाज़ इनपुट समर्थित नहीं)' : ' (Voice input not supported)'));
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const handleClearChat = () => setMessages(getInitialMessages());

  const canSend = input.trim();

  return (
    <div className="farming-chat">
      <header className="farming-chat-header">
        <div className="farming-chat-header-text">
          <h2 className="farming-chat-header-title">{t.chatTitle}</h2>
          <p className="farming-chat-header-subtitle">{t.chatSubtitle}</p>
        </div>
        <button type="button" className="btn btn-clear-chat" onClick={handleClearChat}>
          {t.clearChat}
        </button>
      </header>
      <div className="farming-chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble chat-bubble-${msg.role}`}>
            {msg.image && (
              <div className="chat-bubble-image">
                <img src={msg.image} alt="Uploaded crop" />
              </div>
            )}
            {msg.text && <p className="chat-bubble-text">{msg.text}</p>}
            <span className="chat-bubble-time">{formatTime(msg.timestamp)}</span>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble chat-bubble-assistant chat-bubble-loading">
            <span className="chat-loading-dots">{t.chatLoading}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="farming-chat-input" onSubmit={handleSend}>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="farming-chat-file-input"
          aria-hidden="true"
        />
        <button
          type="button"
          className="btn btn-chat-ico"
          onClick={handleUploadClick}
          title={t.uploadPhoto}
          aria-label={t.uploadPhoto}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
        </button>
        <button
          type="button"
          className={`btn btn-chat-ico ${isListening ? 'active' : ''}`}
          onClick={handleVoice}
          title={t.voiceInput}
          aria-label={t.voiceInput}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
          </svg>
        </button>
        <input
          type="text"
          className="farming-chat-text-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chatPlaceholder}
          aria-label={t.chatPlaceholder}
        />
        <button
          type="submit"
          className="btn btn-secondary btn-send"
          disabled={!canSend}
        >
          {t.send}
        </button>
      </form>
    </div>
  );
}
