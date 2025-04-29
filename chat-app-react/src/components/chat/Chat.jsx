import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  createChat,
  fetchChats,
  sendMessage,
  fetchMessages,
} from "../../services/chatServices";
import { CONST } from "../../utils/constants";

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  const loggedInUserId = localStorage.getItem(CONST.USER_ID);
  useEffect(() => {
    const connectWebSocket = async (roomId) => {
      const roomName = roomId;
      socket.current = new WebSocket(
        `ws://localhost:8000/ws/chat/${roomName}/`
      );

      socket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.message && data.message?.sender != loggedInUserId) {
          setMessages((prev) => [...prev, { sender: {id : data.message?.sender}, content: data.message?.content }]);
        }
      };

      socket.current.onclose = () => {
        console.log("WebSocket disconnected");
      };
    };

    if (!chatId) {
      getchatId();
    } else {
      connectWebSocket(chatId);
    }

    return () => {
      socket.current?.close();
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getchatId = async () => {
    const allChats = await fetchChats();
    const existingChat = allChats.find(
      (chat) =>
        !chat.is_group &&
        chat.members.some((m) => m.id === user.id) &&
        chat.members.some((m) => m.id === parseInt(loggedInUserId))
    );

    if (existingChat) {
      setChatId(existingChat.id);
      const msgs = await fetchMessages(existingChat.id);
      setMessages(msgs);
      return existingChat.id;
    }
  };

  const sendMessages = async () => {
    if (!input.trim()) return;

    var currentChatId = chatId;
    if (!currentChatId) {
      const newChat = await createChat([user.id]);
      currentChatId = newChat.id;
      setChatId(currentChatId);
    }
    const newMessage = { sender: { id: loggedInUserId }, content: input };
    await sendMessage(currentChatId, input);
    setMessages((prev) => [...prev, newMessage]);
    // socket?.current?.send(JSON.stringify({ message: newMessage }));
    setInput("");
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Chat with {user.username}
      </Typography>

      <Box
        sx={{
          height: 300,
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: 2,
          p: 2,
          mb: 2,
          backgroundColor: "#fafafa",
        }}
      >
        {messages.length === 0 ? (
          <Typography color="text.secondary" align="center">
            No messages yet. Say hello!
          </Typography>
        ) : (
          messages.map((msg, idx) => (
            <Typography
              key={idx}
              align={msg.sender.id == loggedInUserId ? "right" : "left"}
              sx={{
                mb: 1,
                color:
                  msg.sender.id == loggedInUserId
                    ? "primary.main"
                    : "text.primary",
              }}
            >
              {msg.content}
            </Typography>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessages();
            }
          }}
        />
        <Button variant="contained" onClick={sendMessages}>
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default Chat;
