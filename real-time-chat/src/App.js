import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("Message received from server:", data);
      const serverMessage = { sender: "Server", text: data }; // Label from server
      setChat((prevChat) => [...prevChat, serverMessage]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const userMessage = { sender: "You", text: message }; // User's message
      setChat((prevChat) => [...prevChat, userMessage]); // Show instantly

      socket.emit("send_message", message); // Send only text to the server
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#F8F1E5]">
      <div className="w-1/2 bg-[#FFF7E3] p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center p-2 mb-2">Real-Time Chat</h2>
        <div className="h-72 overflow-auto border rounded-md p-2 bg-[#D9B382]">
          {chat.map((msg, index) => (
            <p key={index} className="p-1 border-b">
              <strong>{msg.sender}:</strong> {msg.text}
            </p>
          ))}
        </div>

        <input
          className="w-full p-2 border rounded-md mt-2 bg-[#FFF3D9]"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="w-full bg-[#8C5C4D] text-white p-2 rounded mt-2"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
