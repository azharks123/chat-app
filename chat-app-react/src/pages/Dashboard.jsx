import {
  Container,
  TextField,
  Typography,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import UserTile from "../components/user/UserTile";
import { useDebouncedCallback } from "use-debounce";
import Chat from "../components/chat/chatbox";
import { CONST } from "../utils/constants";
import ChatIcon from "@mui/icons-material/Chat";
import StartChatModal from "../components/chat/chatmodal";

import { useDispatch, useSelector } from "react-redux";
import {
  loadChats,
  setActiveChat,
  removeChat,
  addChat,
  markChatUnread,
} from "../store/slices/chatSlice";
import { fetchUsers } from "../store/slices/userSlice";
import { connectToSocket, closeSocket } from "../services/socketServices";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { chats, activeChat } = useSelector((state) => state.chat);
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
  }, [activeChat]);

  const debounced = useDebouncedCallback((searchTerm) => {
    dispatch(fetchUsers(searchTerm));
    setSearch(searchTerm);
  }, 400);

  useEffect(() => {
    if (currentUserId) {
      connectToSocket("notification", currentUserId, handleSocketMessage);
    }

    return () => {
      closeSocket("notification");
    };
  }, [currentUserId]);

  const handleSocketMessage = (data) => {
    console.log("notification recieved", data);
    if (data.message.alert_type === "new_message" && data.message.id) {
      dispatch(markChatUnread(data.message.id));
    }
  };

  const handleDeleteChat = useCallback(
    (chatId) => {
      if (window.confirm("Are you sure you want to delete this chat?")) {
        dispatch(removeChat(chatId));
      }
    },
    [dispatch]
  );

  const handleChatClick = useCallback(
    (chat) => {
      dispatch(setActiveChat(chat));
    },
    [dispatch]
  );

  const getDisplayName = useCallback(
    (chat) => {
      if (chat.is_group) return chat.name;
      return chat.members.find((m) => m.id.toString() !== currentUserId)
        ?.username;
    },
    [currentUserId]
  );

  const handleUserClick = useCallback(
    (user) => {
      const existingChat = chats.find(
        (chat) => !chat?.is_group && chat?.members.some((m) => m.id === user.id)
      );
      if (existingChat) {
        dispatch(setActiveChat(existingChat));
      } else {
        dispatch(addChat({ usersIds: [user.id] }));
      }
    },
    [chats, dispatch]
  );

  const renderedChats = useMemo(
    () =>
      chats.map((chat) => {
        const displayName = getDisplayName(chat);
        console.log(chat);
        return (
          <UserTile
            key={chat.id}
            user={{ ...chat, username: displayName }}
            onClick={() => handleChatClick(chat)}
            onDelete={() => handleDeleteChat(chat.id)}
            isActive={activeChat?.id===chat?.id}
            isUnread={chat.unread}
          />
        );
      }),
    [chats, getDisplayName, handleChatClick, handleDeleteChat]
  );

  const renderedUsers = useMemo(
    () =>
      users.map((user) => (
        <UserTile
          key={user.id}
          user={user}
          onClick={() => handleUserClick(user)}
        />
      )),
    [users, handleUserClick]
  );

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
              <IconButton
                onClick={() => {
                  setSearch("");
                  setOpenChatModal(true);
                }}
              >
                <ChatIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <StartChatModal
            open={openChatModal}
            onClose={() => setOpenChatModal(false)}
          />

          {search ? renderedUsers : renderedChats}
        </Box>

        {/* Right Side: Chat Component */}
        {activeChat && (
          <Box sx={{ flex: 1.5 }}>
            <Chat CurrentChat={activeChat} />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
