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
import { Container, Tooltip, useMediaQuery } from "@mui/material";

import Conversations from "./Conversations";
import ChatHeader from "./Chat-Header";

import ChatBox from "./ChatBox";
import {
  fetchMessages,
  getActiveConversation,
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
import { useQuery } from "@tanstack/react-query";
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
  width: `calc(${theme.spacing(0)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(0)} + 1px)`,
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
    // width: `calc(100% - ${80}px)`,
    // marginLeft: drawerWidth,
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

  // Use the useMediaQuery hook to detect screen size
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  // Set the initial state of the menu based on screen size
  const [open, setOpen] = React.useState(!isSmallScreen);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // const [conversation, setConversation] = useState<any>(null); //participant is the user with whom the current user is chatting
  // const [participants, setParticipants] = useState<any>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  //search modal
  const [openModal, setOpenModal] = useState(false);

  const user = useAuthUser();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");

  const { onlineUsers, socket } = useContext(SocketContext);

  const { data: conversationData } = useQuery<any>({
    queryKey: ["conversations"],
    queryFn: () => getConversation(user._id),
    enabled: !!user,
    select: (data) => {
      return data.data?.data;
    },
  });
  const [conversations, setConversations] = useState<any>([]); //participant is the user with whom the current user is chatting
  const [newConversation, setNewConversation] = useState<any>(null);

  useEffect(() => {
    if (Array.isArray(conversationData)) {
      setConversations(conversationData);
    }
  }, [conversationData]);

  const { data: groupConversations = [] } = useQuery<any>({
    queryKey: ["group-conversations"],
    queryFn: () => getGroupConversation(user._id),
    enabled: !!user,
    select: (data) => {
      return data.data?.data;
    },
  });

  const { data: privateConversations = [] } = useQuery<any>({
    queryKey: ["private-conversations"],
    queryFn: () => getPrivateConversation(user._id),
    enabled: !!user,
    select: (data) => {
      return data.data?.data;
    },
  });

  const { data: participants = [] } = useQuery<any>({
    queryKey: ["participants"],
    queryFn: () => getParticipantByUserId(user._id),
    enabled: !!user,
    select: (data) => {
      return data.data?.data;
    },
  });

  const { data: conversation, refetch: refetchActiveConversation } =
    useQuery<any>({
      queryKey: ["conversation"],
      queryFn: () => getActiveConversation(conversationId || ""),
      enabled: !!conversationId,
      select: (data) => {
        return data.data?.data;
      },
    });

  const fetchMoreMessages = async () => {
    if (conversationId) {
      const newMessages = await fetchMessages(conversationId, page);
      if (newMessages.length === 0) {
        setHasMore(false);
      } else {
        setMessages((prevMessages) => [...newMessages, ...prevMessages]);
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    if (conversationId) {
      refetchActiveConversation();
      fetchMoreMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    if (socket?.connected) {
      socket.on("chat", (data: any) => {
        setMessages((prev) => [data, ...prev]);
      });
    }
  }, [socket?.connected]);

  useEffect(() => {
    socket?.on("conversation", (data: any) => {
      // console.log(data);
      setNewConversation(data);
      const prevState = [...conversations];
      const index = prevState.findIndex(
        (conversation) => conversation._id === data._id
      );
      if (index !== -1) {
        prevState[index].lastMessage = data.lastMessage;
        setConversations(() => prevState);
      }
    });
  }, [socket?.connected, conversations]);

  useEffect(() => {
    if (isSmallScreen) {
      setOpen(false);
    }
  }, [isSmallScreen]);

  return (
    <Container disableGutters>
      <Box
        sx={{
          border: "1px solid green",
          // margin: 1,
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
              newConversation={newConversation}
            />
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1 }}>
            <DrawerHeader />
            <ChatBox
              hasMore={hasMore}
              user={user}
              messages={messages}
              fetchMoreMessages={fetchMoreMessages}
            />
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
