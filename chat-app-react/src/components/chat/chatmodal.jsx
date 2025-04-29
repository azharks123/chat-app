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
import { addChat } from "../../store/slices/chatSlice";

const StartChatModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { chats, activeUser } = useSelector((state) => state.chat);
  const { users } = useSelector((state) => state.user);
  const currentUserId = localStorage.getItem(CONST.USER_ID);
  const [userslist, setUserlist] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  

  useEffect(() => {
    if (open) {
      setSelectedUsers([]);
      setSearch("");
      getChattedUsers(chats);
    }
  }, [open]);

  const getChattedUsers = (chats) => {
    const members = chats
      .filter((chat) => !chat.is_group && chat.members.length > 1)
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
      prev.includes(newUser.id) ? prev.filter((uid) => uid !== newUser.id) : [...prev, newUser.id]
    );
  };
  
  const handleCreate = async () => {
    if (selectedUsers.length > 0) {
      dispatch(addChat({ usersIds: selectedUsers, isGroup: true, chatName: groupName }))
    }
    else {
      dispatch(addChat({ usersIds: selectedUsers, isGroup: false, chatName: '' }))
    }
    onClose();
  };

  const debounced = useDebouncedCallback((searchTerm) => {
    dispatch(fetchUsers(searchTerm));
    setSearch(searchTerm);
  }, 200);

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
              button='true'
              onClick={() => toggleSelectUser(user)}
            >
              <ListItemText primary={user.username} />
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => {
                    toggleSelectUser(user)
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        {selectedUsers.length > 1 && (
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
              selectedUsers.length === 0 ||
              (selectedUsers.length > 1 && !groupName.trim())
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
