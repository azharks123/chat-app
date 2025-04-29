import apiGateway from "../api/axiosClient";

export const fetchChats = async () => {
  const res = await apiGateway.get('chat/chats/');
  return res.data;
};

export const fetchMessages = async (chatId) => {
  const res = await apiGateway.get(`chat/messages/?chat=${chatId}`);
  return res.data;
};

export const sendMessage = async (chatId, content) => {
  const res = await apiGateway.post('chat/messages/', { chat: chatId, content });
  return res.data;
};

export const createChat = async (members, isGroup = false, name = '') => {
  const res = await apiGateway.post('chat/chats/', { members, is_group: isGroup, name });
  return res.data;
};

export const deleteChat = async (chatId) => {
  const res = await apiGateway.delete(`chat/chats/${chatId}/`);
  return res.data;
};