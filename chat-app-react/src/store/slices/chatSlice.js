import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchChats,
  deleteChat,
  createChat,
} from "../../services/chatServices";

export const loadChats = createAsyncThunk("chat/loadChats", async () => {
  return await fetchChats();
});

export const removeChat = createAsyncThunk(
  "chat/removeChat",
  async (chatId) => {
    await deleteChat(chatId);
    return chatId;
  }
);

export const addChat = createAsyncThunk(
  "chat/addChat",
  async ({usersIds, isGroup = false, chatName = ""}) => {
    await createChat(usersIds, isGroup, chatName);
    return chatId;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    activeUser: null,
  },
  reducers: {
    setActiveUser(state, action) {
      state.activeUser = action.payload;
    },
    clearActiveUser(state) {
      state.activeUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChats.fulfilled, (state, action) => {
        state.chats = action.payload;
      })
      .addCase(removeChat.fulfilled, (state, action) => {
        state.chats = state.chats.filter((chat) => chat.id !== action.payload);
        if (state.activeUser?.chatId === action.payload) {
          state.activeUser = null;
        }
      })
      // .addCase(addChat.fulfilled, (state, action) => {
      // });
  },
});

export const { setActiveUser, clearActiveUser } = chatSlice.actions;
export default chatSlice.reducer;
