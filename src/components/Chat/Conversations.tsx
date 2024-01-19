import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import UserList from "./UserList";
import AccountMenu from "./UserMenu";
import { useQueries } from "@tanstack/react-query";
import { getActiveConversation } from "./ApiCalls";
import ConversationsListSkeleton from "../skeleton/Conversations-list";

type PropTypes = {
  conversations: any[];
  user: any;
  onlineUsers: any[];
  groupConversations: any[];
  privateConversations: any[];
  participants: any[];
  newConversation: any;
};

function Conversations({ conversations, user, newConversation }: PropTypes) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const conversationsIds = conversations.map(
    (conversation) => conversation._id
  );
  const { data: updateConversations, isLoading } = useQueries({
    queries: conversationsIds.map((conversationId) => ({
      queryKey: ["conversation", conversationId],
      queryFn: () => getActiveConversation(conversationId),
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data?.data?.data),
        isLoading: results.some((result) => result.isLoading),
        isError: results.some((result) => result.isError),
      };
    },
  });

  return (
    <Stack justifyContent="space-between" height="100%">
      <Box sx={{ flexGrow: 1 }}>
        {isLoading ? (
          <>
            {/* skelton for loader */}
            <ConversationsListSkeleton />
            <ConversationsListSkeleton />
            <ConversationsListSkeleton />
            <ConversationsListSkeleton />
            <ConversationsListSkeleton />
            <ConversationsListSkeleton />
            <ConversationsListSkeleton />
            <ConversationsListSkeleton />
          </>
        ) : (
          <>
            {updateConversations.map((conversation: any, index: number) => {
              if (newConversation && conversation._id === newConversation._id) {
                conversation.lastMessage = newConversation.lastMessage;
                conversation.lastUpdate = newConversation.lastUpdate;
                conversation.readPersons = newConversation.readPersons;
              }

              return (
                <React.Fragment key={conversation?._id}>
                  <UserList
                    open={true}
                    lastMessage={
                      conversation?.lastMessage
                        ? conversation?.lastMessage?.content?.slice(0, 15) +
                          "..."
                        : "No message"
                    }
                    time={dayjs(conversation?.lastUpdate).format("hh:mm A")}
                    userName={conversation?.name}
                    userAvatar={conversation?.avatar}
                    isOnline={conversation?.isOnline}
                    isRead={conversation?.readPersons?.includes(user?._id)}
                    _id={conversation?._id}
                  />
                  {index !== conversations.length - 1 && (
                    <Divider sx={{ padding: 0 }} />
                  )}
                </React.Fragment>
              );
            })}
          </>
        )}
      </Box>
      <Divider sx={{ padding: 0, mb: 2 }} />
      <Stack
        justifyContent="center"
        alignItems="center"
        direction="row"
        spacing={1}
        width={1}
        sx={{
          cursor: "pointer",
          "& :hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <Typography variant="h6">{user?.name}</Typography>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 40, height: 40 }}>{user?.name?.[0]}</Avatar>
          </IconButton>
        </Tooltip>
        <AccountMenu
          anchorEl={anchorEl}
          handleClose={handleClose}
          open={open}
        />
      </Stack>
    </Stack>
  );
}

export default Conversations;
