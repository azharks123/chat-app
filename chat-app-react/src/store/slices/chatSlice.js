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
  async ({ usersIds, isGroup = false, chatName = "" }) => {
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
      
      state.chats = state.chats.map((chat) =>
        chat.id === action.payload.id ? { ...chat, unread: false } : chat
      );
    },
    clearActiveChat(state) {
      state.activeChat = null;
    },
    markChatUnread(state, action) {
      const chatId = action.payload;

      if (state.activeChat.id !== chatId ) {
        state.chats = state.chats.map((chat) =>
          chat.id === chatId ? { ...chat, unread: true } : chat
        );
      }

      // move chat to top of list
      const chatIndex = state.chats.findIndex((c) => c.id === chatId);
      if (chatIndex > -1) {
        const [chat] = state.chats.splice(chatIndex, 1);
        state.chats.unshift(chat);
        
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChats.fulfilled, (state, action) => {
        state.chats = action.payload.map((chat) => ({
          ...chat,
          unread: false,
        }));
      })
      .addCase(removeChat.fulfilled, (state, action) => {
        if (state.activeChat?.id === action.payload) {
          state.activeChat = null;
        }
        state.chats = state.chats.filter((chat) => chat.id !== action.payload);
      })
      .addCase(addChat.fulfilled, (state, action) => {
        const newChat = { ...action.payload, unread: false };
        // put new chat on top
        state.chats.unshift(newChat);
        state.activeChat = newChat;
      });
  },
});

export const { setActiveChat, clearActiveChat, markChatUnread } =
  chatSlice.actions;
export default chatSlice.reducer;
