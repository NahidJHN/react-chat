import { Box, Divider } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import UserList from "./UserList";
import { filterParticipants } from "./ApiCalls";

type PropTypes = {
  conversations: any[];
  user: any;
  onlineUsers: any[];
  groupConversations: any[];
  privateConversations: any[];
  participants: any[];
};

function Conversations({
  conversations,
  onlineUsers,
  groupConversations,
  privateConversations,
  participants,
  user,
}: PropTypes) {
  return (
    <Box>
      {conversations.map((conversation: any, index: number) => {
        const filterConversation = filterParticipants(
          conversation,
          groupConversations,
          privateConversations,
          participants,
          onlineUsers,
          user
        );

        return (
          <React.Fragment key={filterConversation._id}>
            <UserList
              open={true}
              lastMessage={
                filterConversation.lastMessage?.content?.slice(0, 15) + "..." ||
                "No message"
              }
              time={dayjs(filterConversation.lastUpdate).format("hh:mm A")}
              userName={filterConversation?.name}
              userAvatar={filterConversation?.avatar}
              isOnline={filterConversation.isOnline}
              isRead={filterConversation?.readPersons?.includes(user?._id)}
              _id={filterConversation._id}
            />
            {index !== conversations.length - 1 && (
              <Divider sx={{ padding: 0 }} />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
}

export default Conversations;
