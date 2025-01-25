import React, { useState } from "react";
import axios from "axios";

function App() {
    const [inputQuery, setInputQuery] = useState(""); // User query
    const [chatHistory, setChatHistory] = useState([
        { sender: "bot", text: "Hi! I'm your assistant. How can I help you today?" }, // Initial welcome message
    ]);

    // Handle query submission
    const handleQuery = async () => {
        if (!inputQuery.trim()) return; // Prevent empty queries

        // Add user query to chat history
        setChatHistory((prev) => [...prev, { sender: "user", text: inputQuery }]);

        try {
            // Send query to backend
            const res = await axios.post("http://127.0.0.1:5000/chat", {
                query: inputQuery,
            });

            // Log the response for debugging
            console.log("Backend Response:", res.data);

            // Add bot response to chat history
            const botResponse = res.data.summary || "I'm sorry, I couldn't process your request.";
            setChatHistory((prev) => [...prev, { sender: "bot", text: botResponse }]);
        } catch (err) {
            console.error("Error fetching data:", err);
            setChatHistory((prev) => [
                ...prev,
                { sender: "bot", text: "Failed to fetch data. Please try again later." },
            ]);
        }

        setInputQuery(""); // Clear input
    };

    return (
        <div style={styles.container}>
            <div style={styles.chatContainer}>
                <div style={styles.header}>
                    <h2>Chatbot Assistant</h2>
                </div>
                <div style={styles.chatBox}>
                    {chatHistory.map((chat, index) => (
                        <div
                            key={index}
                            style={chat.sender === "bot" ? styles.botMessage : styles.userMessage}
                        >
                            {chat.text}
                        </div>
                    ))}
                </div>
                <div style={styles.inputContainer}>
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={inputQuery}
                        onChange={(e) => setInputQuery(e.target.value)}
                        style={styles.input}
                    />
                    <button onClick={handleQuery} style={styles.button}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f6f8",
        fontFamily: "'Arial', sans-serif",
    },
    chatContainer: {
        width: "400px",
        height: "600px",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ccc",
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "#fff",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    },
    header: {
        backgroundColor: "#007BFF",
        color: "#fff",
        textAlign: "center",
        padding: "10px 0",
        fontSize: "18px",
    },
    chatBox: {
        flex: 1,
        padding: "15px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    botMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#f1f0f0",
        color: "#000",
        padding: "10px",
        borderRadius: "10px",
        maxWidth: "70%",
        fontSize: "14px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    userMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#007BFF",
        color: "#fff",
        padding: "10px",
        borderRadius: "10px",
        maxWidth: "70%",
        fontSize: "14px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    inputContainer: {
        display: "flex",
        padding: "10px",
        borderTop: "1px solid #ccc",
        backgroundColor: "#f9f9f9",
    },
    input: {
        flex: 1,
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "14px",
    },
    button: {
        marginLeft: "10px",
        padding: "10px 15px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
    },
};

export default App;
