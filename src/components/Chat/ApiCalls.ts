import baseUrl from "../../utils/baseURL";

export const getConversation = async (
  setConversations: Function,
  userId: string
) => {
  try {
    const { data } = await baseUrl(`conversations/${userId}`);
    setConversations(data.data);
  } catch (error) {
    console.log(error);
  }
};

export const getGroupConversation = async (
  setGroupConversation: Function,
  userId: string
) => {
  try {
    const { data } = await baseUrl(`conversations/group/${userId}`);
    setGroupConversation(data.data);
  } catch (error) {
    console.log(error);
  }
};
export const getPrivateConversation = async (
  setPrivateConversation: Function,
  userId: string
) => {
  try {
    const { data } = await baseUrl(`conversations/private/${userId}`);
    setPrivateConversation(data.data);
  } catch (error) {
    console.log(error);
  }
};

export const getParticipantByUserId = async (
  setParticipants: Function,
  userId: string
) => {
  try {
    const { data } = await baseUrl(`conversations/participants/${userId}`);
    setParticipants(data.data);
  } catch (error) {
    console.log(error);
  }
};

//fetch messages function
export const fetchMessages = async (
  conversationId: string,
  setMessages: Function
) => {
  try {
    const { data } = await baseUrl.get(`messages/${conversationId}`);
    setMessages(data.data);
  } catch (error) {
    console.log(error);
  }
};

// filter participants
export const filterParticipants = (
  conversation: any,
  groupConversations: any[],
  privateConversations: any[],
  participants: any[],
  onlineUsers: any[],
  user: any
) => {
  const isGroup = conversation?.type === "group";

  if (isGroup) {
    const groupConversation = groupConversations?.find(
      (item) => item._id === conversation.groupConversation
    );
    conversation.name = groupConversation?.name;
    conversation.avatar = groupConversation?.avatar;
  } else {
    const privateConversation = privateConversations?.find(
      (item: any) => item._id === conversation?.privateConversation
    );
    //search the other person, creator or participant
    const searchValue =
      privateConversation?.participant === user?._id
        ? privateConversation?.creator
        : privateConversation?.participant;

    const participant = participants?.find(
      (item: any) => item._id === searchValue
    );
    conversation.avatar = participant?.avatar;
    conversation.name = participant?.name;

    const onlineUser = onlineUsers?.find(
      (item: any) => item._id === participant?._id
    );
    if (onlineUser) {
      conversation.isOnline = true;
    }
  }
  return conversation;
};
