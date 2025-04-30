import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Container,
} from "@mui/material";
import { fetchUsers, removeUser } from "../store/slices/userSlice";

import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const debounced = useDebouncedCallback((searchTerm) => {
    dispatch(fetchUsers(searchTerm));
    setSearch(searchTerm);
  }, 400);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Admin Panel - User Management
        </Typography>
        <TextField
          fullWidth
          placeholder="Search users..."
          margin="normal"
          value={search}
          onChange={(e) => debounced(e.target.value)}
        />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => dispatch(removeUser(user.id))}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};

export default AdminPanel;
