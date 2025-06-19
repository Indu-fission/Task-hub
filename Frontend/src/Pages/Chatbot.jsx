import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const API_URL = "http://localhost:7189/api/chat";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(null);

  const [feedback, setFeedback] = useState({});
  const [emojiVisible, setEmojiVisible] = useState({});
  const [copiedIndex, setCopiedIndex] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(API_URL, {
        messages: [{ role: "user", content: input }],
      });

      const botReply =
        response.data.reply ||
        "Sorry, I don't have an answer to that right now.";
      const finalMessages = [
        ...updatedMessages,
        { role: "bot", content: botReply },
      ];
      setMessages(finalMessages);

      if (currentChatIndex === null) {
        const chatName = input.substring(0, 15);
        const newChat = { name: chatName, messages: finalMessages };

        setChatHistory([...chatHistory, newChat]);
        setCurrentChatIndex(chatHistory.length);
      } else {
        const updatedChatHistory = [...chatHistory];
        updatedChatHistory[currentChatIndex].messages = finalMessages;
        setChatHistory(updatedChatHistory);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...updatedMessages,
        {
          role: "bot",
          content: "Something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatIndex(null);
  };

  const showEmoji = (index, type) => {
    setFeedback({ ...feedback, [index]: type });
    setEmojiVisible({ ...emojiVisible, [index]: type });

    setTimeout(() => {
      setEmojiVisible((prev) => ({ ...prev, [index]: null }));
    }, 2500);
  };

  const handleCopy = (index, content) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="flex overflow-hidden bg-[#f5f1ec] text-black">
      {/* Sidebar */}
      <div className="h-[90vh] w-64 bg-white p-4 flex flex-col shadow-md border-r border-gray-300">
        <h2 className="text-lg font-bold text-center mb-2">Chat History</h2>
        <button
          className="mb-4 p-2 bg-gray-700 rounded hover:bg-gray-800 text-white w-full cursor-pointer"
          onClick={startNewChat}
        >
          + New Chat
        </button>
        {chatHistory.map((chat, index) => (
          <button
            key={index}
            className={`w-full p-2 rounded text-left hover:bg-gray-100 mb-1 ${
              index === currentChatIndex ? "bg-gray-200" : "bg-white"
            }`}
            onClick={() => {
              setMessages(chat.messages);
              setCurrentChatIndex(index);
            }}
          >
            {chat.name}
          </button>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="w-[93%] max-w-[81rem] p-4 mt-[5vh] bg-white rounded-lg shadow-lg flex flex-col h-[78vh] mb-[160px]">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
            ChatGPT Clone
          </h2>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto border border-gray-300 p-3 rounded-lg bg-[#f9f9f9]">
            {messages.length === 0 ? (
              <div className="text-gray-400 text-center mt-10">
                Start typing to begin a new chat...
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 my-2 rounded-lg max-w-[75%] ${
                    msg.role === "user"
                      ? "bg-gray-200 self-end text-left ml-[320px]"
                      : "bg-gray-100 self-start text-left mr-2"
                  }`}
                  style={{
                    marginLeft: msg.role === "user" ? "auto" : "0",
                    marginRight: msg.role === "bot" ? "auto" : "0",
                  }}
                >
                  {msg.role === "bot" ? (
                    <>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>

                      {/* Icons with popup feedback */}
                      <div className="mt-2 flex space-x-6 items-center text-gray-500 text-sm relative">
                        {/* 👍 */}
                        <div className="flex flex-col items-center">
                          <button
                            title="Thumbs Up"
                            onClick={() => showEmoji(index, "up")}
                            className={`hover:text-yellow-500 ${
                              feedback[index] === "up"
                                ? "text-yellow-400"
                                : ""
                            } animate-pulse hover:scale-105 transition-transform`}
                          >
                            👍
                          </button>
                          {emojiVisible[index] === "up" && (
                            <div className="text-xl animate-bounce mt-1">😊</div>
                          )}
                        </div>

                        {/* 👎 */}
                        <div className="flex flex-col items-center">
                          <button
                            title="Thumbs Down"
                            onClick={() => showEmoji(index, "down")}
                            className={`hover:text-yellow-500 ${
                              feedback[index] === "down"
                                ? "text-yellow-400"
                                : ""
                            } animate-pulse hover:scale-105 transition-transform`}
                          >
                            👎
                          </button>
                          {emojiVisible[index] === "down" && (
                            <div className="text-xl animate-bounce mt-1">😔</div>
                          )}
                        </div>

                        {/* 📋 */}
                        <div className="flex flex-col items-center">
                          <button
                            title="Copy"
                            onClick={() => handleCopy(index, msg.content)}
                            className="hover:text-yellow-500 animate-pulse hover:scale-105 transition-transform"
                          >
                            📋
                          </button>
                          {copiedIndex === index && (
                            <div className="text-xs text-green-600 mt-1">
                              Copied!
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    msg.content
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-center items-center p-3 my-2 rounded-lg bg-gray-100 self-start">
                <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Input box */}
          <div className="mt-4 flex">
            <input
              className="flex-1 p-2 rounded-l-lg border border-gray-400 bg-white text-black"
              placeholder="Type a message..."
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-r-lg"
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
