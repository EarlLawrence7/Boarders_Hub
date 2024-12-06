import React, { useState, useEffect, useRef } from 'react';
import Groq from 'groq-sdk';  // Groq SDK import
import './ChatBot.css';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,  // Access API key from .env
  dangerouslyAllowBrowser: true  // Allow usage in the browser environment
});

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const messagesEndRef = useRef(null);  // Reference for auto-scrolling

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      _id: new Date().getTime(),
      text: "Welcome to Cebu Travel Bot! 🎉 Ask me about places to visit, things to do, or distances in Cebu.",
      createdAt: new Date(),
      user: { _id: 2, name: 'Cebu Bot' }
    };
    setMessages([welcomeMessage]);
  }, []);

  // Scroll to the bottom of the chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    const userMessage = {
      _id: new Date().getTime(),
      text: text,
      createdAt: new Date(),
      user: { _id: 1 }
    };
    setMessages((messages) => [...messages, userMessage]);

    const messageText = text.toLowerCase();

    // List of Cebu-related keywords
    const cebuKeywords = [
      'cebu', 'mactan', 'cebu city', 'bohol', 'bantayan', 'moalboal', 'oslob', 'badian', 'sumilon', 'colon street',
      'fort san pedro', 'magellan\'s cross', 'toslob', 'cebuano', 'tabo-an market', 'church', 'beach', 'resort',
      'waterfall', 'island', 'pescador island', 'whale shark', 'mountain', 'top', 'village', 'historic', 'shopping', 
      'mall', 'restaurant', 'food', 'tour', 'activity', 'place', 'hotel', 'airport', 'museum', 'landmark', 'dive', 
      'scuba', 'adventure', 'trip', 'transport', 'bus', 'jeepney'
    ];

    if (cebuKeywords.some((keyword) => messageText.includes(keyword))) {
      setLoading(true);

      try {
        // Send request to Groq API using Groq SDK for Cebu-related queries
        const response = await groq.chat.completions.create({
          model: "gemma-7b-it",  // Specify the model (change as needed)
          messages: [
            {
              role: "user",
              content: messageText,
            },
          ],
        });

        const responseText = response.choices[0]?.message?.content.trim() || 'Sorry, I could not find information on that place.';
        const formattedResponse = responseText.replace(/\n/g, '<br/>');

        const botMessage = {
          _id: new Date().getTime(),
          text: formattedResponse,
          createdAt: new Date(),
          user: { _id: 2, name: 'Cebu Bot' }
        };
        setMessages((messages) => [...messages, botMessage]);
      } catch (error) {
        console.error('Error fetching response from Groq:', error);
        const errorMessage = {
          _id: new Date().getTime(),
          text: `Error: Unable to get response from the AI API. ${error.message}`,
          createdAt: new Date(),
          user: { _id: 2, name: 'Cebu Bot' }
        };
        setMessages((messages) => [...messages, errorMessage]);
      } finally {
        setLoading(false);
      }
    } else {
      const botMessage = {
        _id: new Date().getTime(),
        text: "I can only help with questions related to Cebu. Please ask about places, activities, or landmarks.",
        createdAt: new Date(),
        user: { _id: 2, name: 'Cebu Bot' }
      };
      setMessages((messages) => [...messages, botMessage]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = query.trim();
    if (text) {
      handleSend(text);
    }
    setQuery('');
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>Cebu Travel Bot</h2>
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chatbot-message ${message.user._id === 1 ? 'user-message' : 'bot-message'}`}
            dangerouslySetInnerHTML={{ __html: message.text }}
          />
        ))}
        {loading && (
          <div className="chatbot-message bot-message" style={{ textAlign: 'center' }}>
            <span>...</span>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* This is the reference for auto-scrolling */}
      </div>

      <form className="chatbot-input" onSubmit={handleSubmit}>
        <input
          type="text"
          name="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me about places in Cebu..."
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBot;
