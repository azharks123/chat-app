import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { sendMessage, fetchMessages } from "../../services/chatServices";
import { CONST } from "../../utils/constants";
import { closeSocket, connectToSocket } from "../../services/socketServices";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";

const Chat = ({ CurrentChat }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const loggedInUserId = parseInt(localStorage.getItem(CONST.USER_ID));
  const [openMembers, setOpenMembers] = useState(false);

  useEffect(() => {
    if (CurrentChat?.id) {
      connectToSocket("chat", CurrentChat.id, handleSocketMessage);
    }

    return () => {
      closeSocket("chat");
    };
  }, [CurrentChat?.id]);

  useEffect(() => {
    const loadMessages = async () => {
      if (CurrentChat?.id) {
        const msgs = await fetchMessages(CurrentChat.id);
        setMessages(msgs);
      }
      setInput("");
    };

    loadMessages();

    return () => {
      setMessages([]);
    };
  }, [CurrentChat?.id]);

  const handleSocketMessage = (data) => {
    if (data.message && data.message?.sender !== loggedInUserId) {
      setMessages((prev) => [
        ...prev,
        {
          sender: { id: data.message.sender },
          content: data.message.content,
        },
      ]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessages = async () => {
    if (!input.trim() || !CurrentChat?.id) return;

    const newMessage = {
      sender: { id: loggedInUserId },
      content: input,
    };

    await sendMessage(CurrentChat.id, input);
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const getTitle = () => {
    if (CurrentChat?.is_group) return CurrentChat.name;
    const otherUser = CurrentChat?.members.find((m) => m.id !== loggedInUserId);
    return 'Chat with ' + otherUser?.username || "User";
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          {getTitle()}
        </Typography>

        {CurrentChat.is_group && <Tooltip title="Show Members">
          <IconButton onClick={() => setOpenMembers(true)}>
            <GroupIcon />
          </IconButton>
        </Tooltip>}
      </Box>

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
        {
          messages.length === 0 ? (
            <Typography color="text.secondary" align="center">
              No messages yet. Say hello!
            </Typography>
          ) : (
            <>
              {messages.map((msg, idx) => {
                const isOwnMessage = msg.sender.id == loggedInUserId;
                const senderName = isOwnMessage
                  ? "You"
                  : CurrentChat.members.find((m) => m.id === msg.sender.id)
                      ?.username || "Unknown";

                return (
                  <Box key={idx} sx={{ mb: 1 }}>
                    {CurrentChat.is_group && (
                      <Typography
                        variant="caption"
                        align={isOwnMessage ? "right" : "left"}
                        sx={{
                          display: "block",
                          color: "text.secondary",
                          textAlign: isOwnMessage ? "right" : "left",
                          mb: -1,
                        }}
                      >
                        {senderName}
                      </Typography>
                    )}
                    <Typography
                      align={isOwnMessage ? "right" : "left"}
                      sx={{
                        color: isOwnMessage ? "primary.main" : "text.primary",
                      }}
                    >
                      {msg.content}
                    </Typography>
                  </Box>
                );
              })}
            </>
          )
          // (
          //   messages.map((msg, idx) => (
          //     <Typography
          //       key={idx}
          //       align={msg.sender.id === loggedInUserId ? "right" : "left"}
          //       sx={{
          //         mb: 1,
          //         color:
          //           msg.sender.id === loggedInUserId
          //             ? "primary.main"
          //             : "text.primary",
          //       }}
          //     >
          //       {msg.content}
          //     </Typography>
          //   ))
          // )
        }
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessages();
          }}
        />
        <Button variant="contained" onClick={sendMessages}>
          Send
        </Button>
      </Box>
      <Dialog open={openMembers} onClose={() => setOpenMembers(false)}>
        <DialogTitle>Members</DialogTitle>
        <List>
          {CurrentChat?.members?.map((member) => (
            <ListItem key={member.id}>
              <ListItemText
                primary={
                  member.username +
                  (member.id === loggedInUserId ? " - You" : "")
                }
                // secondary={member.id === loggedInUserId ? "You" : null}
              />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </Paper>
  );
};

export default Chat;
