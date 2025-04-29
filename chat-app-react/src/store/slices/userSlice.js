import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserList } from "../../api/api";

export const fetchUsers = createAsyncThunk("user/fetchUsers", async (search = "") => {
  const res = await getUserList(search);
  return res?.data;
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
    });
  },
});

// export const { setSearch } = userSlice.actions;
export default userSlice.reducer;