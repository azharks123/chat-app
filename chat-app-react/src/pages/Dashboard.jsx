import { Container, TextField, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import UserTile from "../components/user/UserTile";
import { useDebouncedCallback } from 'use-debounce';
import Chat from "../components/chat/Chat";
import { getUserList } from "../api/api";
import { deleteChat, fetchChats } from "../services/chatServices";
import { CONST } from "../utils/constants";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [activeUser, setActiveUser] = useState(null);
  const [chats, setChats] = useState([]);
  const loggedInUserName = localStorage.getItem(CONST.USER_NAME);
  
  useEffect(() => {
    const loadChats = async () => {
      const chatList = await fetchChats();
      setChats(chatList);
    };
    loadChats();
  }, []);

  useEffect(() => {
    setSearch('');
  }, [activeUser]);

  const debounced = useDebouncedCallback(
    async (search) => {
      const res = await getUserList(search);
      setUsers(res?.data);
    },
    200
  );

  const filtered = users?.filter((u) =>
    u?.username.toLowerCase().includes(search.toLowerCase())
  );

  const getOtherUser = (chat) => {
    const currentUserId = localStorage.getItem(CONST.USER_ID);
    return chat.members.find(m => m.id.toString() !== currentUserId);
  };

  const handleDeleteChat = async (chatId) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      try {
        await deleteChat(chatId);
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        if (activeUser && activeUser.chatId === chatId) {
          setActiveUser(null);
        }
      } catch (error) {
        console.error("Failed to delete chat:", error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>{loggedInUserName}</Typography>
  
      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* Left Side: User Dashboard */}
        <Box sx={{ flex: 1 }}>
          <TextField
            placeholder="Search users..."
            fullWidth
            margin="normal"
            value={search}
            onChange={(e) => {
              debounced(e.target.value);
              setSearch(e.target.value);
            }}
          />
  
          {search ? (
            <>
              {filtered.map((user) => (
                <UserTile
                  key={user.id}
                  user={user}
                  onClick={() => {
                    setActiveUser(user);
                  }}
                />
              ))}
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>Recent Chats</Typography>
              <Box>
                {chats.map((chat) => {
                  const otherUser = getOtherUser(chat);
                  return otherUser ? (
                    <UserTile
                      key={chat.id}
                      user={otherUser}
                      onClick={() => setActiveUser(otherUser)}
                      onDelete={() => handleDeleteChat(chat.id)}
                    />
                  ) : null;
                })}
              </Box>
            </>
          )}
        </Box>
  
        {/* Right Side: Chat Component */}
        {activeUser && (
          <Box sx={{ flex: 1.5 }}>
            <Chat user={activeUser} />
          </Box>
        )}
      </Box>
    </Container>
  );
  
};

export default Dashboard;
