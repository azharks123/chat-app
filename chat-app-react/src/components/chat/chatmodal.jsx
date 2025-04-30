import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Button,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CONST } from "../../utils/constants";
import { useDebouncedCallback } from "use-debounce";
import { fetchUsers } from "../../store/slices/userSlice";
import { addChat, setActiveChat } from "../../store/slices/chatSlice";

const StartChatModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { chats } = useSelector((state) => state.chat);
  const { users } = useSelector((state) => state.user);
  const currentUserId = localStorage.getItem(CONST.USER_ID);
  const [userslist, setUserlist] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUserIds, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedUsers([]);
      setSearch("");
      getChattedUsers(chats);
    }
  }, [open]);

  const getChattedUsers = (chats) => {
    const members = chats
      .filter((chat) => !chat.is_group)
      .map((chat) =>
        chat.members.find((m) => m.id.toString() !== currentUserId)
      )
      .filter(Boolean);
    setUserlist(members);
  };

  const toggleSelectUser = (newUser) => {
    setUserlist((prevList) => {
      const exists = prevList.some((user) => user.id === newUser.id);
      if (exists) return prevList;
      return [newUser, ...prevList];
    });

    setSelectedUsers((prev) =>
      prev.includes(newUser.id)
        ? prev.filter((uid) => uid !== newUser.id)
        : [...prev, newUser.id]
    );
  };

  const handleCreate = async () => {
    if (selectedUserIds.length > 1) {
      dispatch(
        addChat({
          usersIds: selectedUserIds,
          isGroup: true,
          chatName: groupName,
        })
      );
    } else {
      const existingChat = chats.find(
        (chat) =>
          !chat?.is_group &&
          chat?.members.some((m) => m.id === selectedUserIds[0])
      );
      if (existingChat) {
        dispatch(setActiveChat(existingChat));
      } else {
        dispatch(addChat({ usersIds: selectedUserIds }));
      }
    }
    onClose();
  };

  const debounced = useDebouncedCallback((searchTerm) => {
    dispatch(fetchUsers(searchTerm));
    setSearch(searchTerm);
  }, 400);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select Users to Start Chat</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            debounced(e.target.value);
          }}
          sx={{ mb: 2 }}
        />

        <List dense>
          {(search.length > 0 ? users : userslist).map((user) => (
            <ListItem
              key={user.id}
              button="true"
              onClick={() => toggleSelectUser(user)}
            >
              <ListItemText primary={user.username} />
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  checked={selectedUserIds.includes(user.id)}
                  onChange={() => {
                    toggleSelectUser(user);
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        {selectedUserIds.length > 1 && (
          <TextField
            fullWidth
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={{ mt: 2 }}
          />
        )}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={
              selectedUserIds.length === 0 ||
              (selectedUserIds.length > 1 && !groupName.trim())
            }
          >
            Start Chat
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StartChatModal;
