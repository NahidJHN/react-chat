/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Container, Tooltip } from "@mui/material";

import Conversations from "./Conversations";
import ChatHeader from "./Chat-Header";

import ChatBox from "./ChatBox";
import {
  fetchMessages,
  filterParticipants,
  getConversation,
  getGroupConversation,
  getParticipantByUserId,
  getPrivateConversation,
} from "./ApiCalls";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import FormDialog from "./SearchModal";
import useAuthUser from "../../hooks/AuthUser";
import { useSearchParams } from "react-router-dom";
import { SocketContext } from "../../context/Socket.context";
const drawerWidth = 300;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(${theme.spacing(9)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    width: `calc(100% - ${80}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  backgroundImage: "none",
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
  "& .MuiDrawer-paper": {
    boxSizing: "border-box",
    position: "relative",
    overflowX: "hidden",
  },
}));

export default function Chat() {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [conversations, setConversations] = useState<any[]>([]);
  const [groupConversations, setGroupConversations] = useState<any[]>([]);
  const [privateConversations, setPrivateConversations] = useState<any[]>([]);
  const [conversation, setConversation] = useState<any>(null); //participant is the user with whom the current user is chatting
  const [participants, setParticipants] = useState<any>([]);
  const [messages, setMessages] = useState<any[]>([]);

  //search modal
  const [openModal, setOpenModal] = useState(false);

  const user = useAuthUser();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");

  const { onlineUsers, socket } = useContext(SocketContext);

  useEffect(() => {
    if (user) {
      getConversation(setConversations, user._id);
      getGroupConversation(setGroupConversations, user._id);
      getPrivateConversation(setPrivateConversations, user._id);
      getParticipantByUserId(setParticipants, user._id);
    }
  }, [user]);

  useEffect(() => {
    if (
      conversationId &&
      conversations.length &&
      participants.length &&
      (privateConversations.length || groupConversations.length)
    ) {
      const conversation = conversations.find(
        (item) => item._id === conversationId
      );
      const filterConversation = filterParticipants(
        conversation,
        groupConversations,
        privateConversations,
        participants,
        onlineUsers,
        user
      );
      setConversation(filterConversation);
    }
  }, [
    conversationId,
    participants,
    onlineUsers,
    conversations,
    groupConversations,
    privateConversations,
    messages,
  ]);
  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId, setMessages);
    }
  }, [conversationId]);

  useEffect(() => {
    if (socket?.connected) {
      socket.on("chat", (data: any) => {
        setMessages((prevState) => [...prevState, data]);
        // audioRef.current?.play();
      });

      socket.on("conversation", (data: any) => {
        const prevState = [...conversations];

        const index = prevState.findIndex(
          (conversation) => conversation._id === data._id
        );
        if (index !== -1) {
          prevState[index] = data;
        }
        setConversations(prevState);
      });
    }
  }, [socket?.connected]);

  return (
    <Container>
      <Box
        sx={{
          border: "1px solid green",
          margin: 1,
          height: "95vh",
        }}
      >
        <Box sx={{ display: "flex", position: "relative", maxHeight: "100%" }}>
          <AppBar position="absolute" open={open} elevation={0}>
            <Toolbar sx={{ display: "flex", justifyContent: "start" }}>
              <Box>
                {open ? (
                  <Tooltip title="Close" placement="bottom">
                    <IconButton
                      color="inherit"
                      aria-label="close drawer"
                      onClick={handleDrawerClose}
                      edge="start"
                    >
                      <MenuOpenIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Open" placement="bottom">
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={handleDrawerOpen}
                      edge="start"
                    >
                      <MenuIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              <Box sx={{ flexGrow: 1, marginLeft: { xs: 0.5, sm: 1, md: 3 } }}>
                {conversation && (
                  <ChatHeader
                    avatar={conversation.avatar}
                    isOnline={conversation.isOnline}
                    lastActiveTime={conversation.lastActiveTime}
                    userName={conversation.name}
                  />
                )}
              </Box>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <DrawerHeader
              sx={{
                display: "flex",
                direction: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Tooltip title="Create Conversation" placement="bottom">
                <IconButton color="primary" onClick={() => setOpenModal(true)}>
                  <MapsUgcIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="h6" flex={1} textAlign="center">
                Chats
              </Typography>
            </DrawerHeader>
            <Divider />
            <Divider />
            <Conversations
              conversations={conversations}
              groupConversations={groupConversations}
              privateConversations={privateConversations}
              participants={participants}
              user={user}
              onlineUsers={onlineUsers}
            />
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1 }}>
            <DrawerHeader />
            <ChatBox user={user} messages={messages} />
          </Box>
          <FormDialog
            user={user}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        </Box>
      </Box>
      <Box sx={{ display: "none" }}>
        <audio ref={audioRef} src="/chat-sound.mp3" controls />
      </Box>
    </Container>
  );
}
