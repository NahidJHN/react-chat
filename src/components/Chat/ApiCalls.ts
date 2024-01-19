import baseUrl from "../../utils/baseURL";

export const getConversation = (userId: string) => {
  return baseUrl(`conversations/${userId}`);
};

export const getGroupConversation = (userId: string) => {
  return baseUrl(`conversations/group/${userId}`);
};

export const getPrivateConversation = (userId: string) => {
  return baseUrl(`conversations/private/${userId}`);
};

export const getParticipantByUserId = async (userId: string) => {
  return baseUrl(`conversations/participants/${userId}`);
};

//fetch active conversations function
export const getActiveConversation = async (conversationId: string) => {
  return baseUrl.get(`conversations/active/${conversationId}`);
};

//fetch messages function
export const fetchMessages = async (
  conversationId: string,
  page: number,
  setPage: any
) => {
  const { data } = await baseUrl.get(`messages/${conversationId}?page=${page}`);
  setPage((prev: number) => prev + 1);
  return data?.data || [];
};
