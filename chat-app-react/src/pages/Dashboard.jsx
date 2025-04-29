import {
  Container,
  TextField,
  Typography,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import UserTile from "../components/user/UserTile";
import { useDebouncedCallback } from "use-debounce";
import Chat from "../components/chat/chatbox";
import { CONST } from "../utils/constants";
import ChatIcon from "@mui/icons-material/Chat";
import StartChatModal from "../components/chat/chatmodal";

import { useDispatch, useSelector } from "react-redux";
import { loadChats, setActiveUser, removeChat } from "../store/slices/chatSlice";
import { fetchUsers } from "../store/slices/userSlice";

const Dashboard = () => {

  const dispatch = useDispatch();
  const { chats, activeUser } = useSelector((state) => state.chat);
  const { users } = useSelector((state) => state.user);
  const loggedInUserName = localStorage.getItem(CONST.USER_NAME);
  const [openChatModal, setOpenChatModal] = useState(false);
  const currentUserId = localStorage.getItem(CONST.USER_ID);
  const [search, setSearch] = useState("");


  useEffect(() => {
    dispatch(loadChats());
  }, []);
    
  useEffect(() => {
    setSearch("");
  }, [activeUser]);
  
  const debounced = useDebouncedCallback((searchTerm) => {
    dispatch(fetchUsers(searchTerm));
    setSearch(searchTerm);
  }, 200);

  const getOtherUser = (chat) => {
    return chat.members.find((m) => m.id.toString() !== currentUserId);
  };

  const handleDeleteChat = (chatId) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      dispatch(removeChat(chatId));
    }
  };    

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {loggedInUserName}
      </Typography>

      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Left Side: User Dashboard */}
        <Box sx={{ flex: 1 }}>
          <TextField
            placeholder="Search users..."
            fullWidth
            margin="normal"
            value={search}
            onChange={(e) => {
              debounced(e.target.value);
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5">Chats</Typography>
            <Tooltip title="Start New Chat">
              <IconButton onClick={() => setOpenChatModal(true)}>
                <ChatIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <StartChatModal
            open={openChatModal}
            onClose={() => setOpenChatModal(false)}
          />

          {search ? (
            <>
              {users.map((user) => (
                <UserTile
                  key={user.id}
                  user={user}
                  onClick={() => {
                    dispatch(setActiveUser(user));
                  }}
                  />
                ))}
            </>
          ) : (
            <Box>
              {chats.map((chat) => {
                const isGroup = chat.is_group;
                const displayName = isGroup
                  ? chat.name
                  : chat.members.find((m) => m.id.toString() !== currentUserId)?.username;

                return (
                  <UserTile
                    key={chat.id}
                    user={{ ...chat, username: displayName }}
                    onClick={() => {
                      dispatch(setActiveUser(chat));
                    }}
                    onDelete={() => handleDeleteChat(chat.id)}
                  />
                );
              })}
            </Box>
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
