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
    const newChat = await createChat(usersIds, isGroup, chatName);
    return newChat;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    activeChat: null,
  },
  reducers: {
    setActiveChat(state, action) {
      state.activeChat = action.payload;
    },
    clearActiveChat(state) {
      state.activeChat = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChats.fulfilled, (state, action) => {
        state.chats = action.payload;
      })
      .addCase(removeChat.fulfilled, (state, action) => {
        state.chats = state.chats.filter((chat) => chat.id !== action.payload);
        if (state.activeChat?.chatId === action.payload) {
          state.activeChat = null;
        }
      })
      .addCase(addChat.fulfilled, (state, action) => {
        const newChat = action.payload;
        state.chats.push(newChat);
        state.activeChat = newChat;
      });
  },
});

export const { setActiveChat, clearActiveChat } = chatSlice.actions;
export default chatSlice.reducer;
