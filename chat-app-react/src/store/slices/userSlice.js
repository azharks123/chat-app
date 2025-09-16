import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteUser, getUserList } from "../../api/api";

export const fetchUsers = createAsyncThunk("user/fetchUsers", async (search = "") => {
  const res = await getUserList(search);
  return res?.data;
});

export const removeUser = createAsyncThunk("user/removeUser", async (userId) => {
  await deleteUser(userId);
  return userId;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    })
    builder.addCase(removeUser.fulfilled, (state, action) => {      
      state.users = state.users.filter((user) => user.id !== action.payload);
    });
  },
});

export default userSlice.reducer;