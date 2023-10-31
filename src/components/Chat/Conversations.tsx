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
import { filterParticipants } from "./ApiCalls";
import AccountMenu from "./UserMenu";

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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack justifyContent="space-between" height="100%">
      <Box sx={{ flexGrow: 1 }}>
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
                  filterConversation.lastMessage
                    ? filterConversation.lastMessage?.content?.slice(0, 15) +
                      "..."
                    : "No message"
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
