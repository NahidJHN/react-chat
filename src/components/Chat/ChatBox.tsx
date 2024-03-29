/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/SendOutlined";

import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { SocketContext } from "../../context/Socket.context";
import { useSearchParams } from "react-router-dom";
import Message from "../Message/Message";
import ChatIcon from "@mui/icons-material/Chat";
import InfiniteScroll from "react-infinite-scroll-component";

type PropTypes = {
  user: any;
  messages: any[];
  fetchMoreMessages: () => void;
  hasMore: boolean;
};

function ChatBox({ user, messages, fetchMoreMessages, hasMore }: PropTypes) {
  const theme = useTheme();

  const { socket } = useContext(SocketContext);

  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");

  const [message, setMessage] = useState<string>("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);

    e.preventDefault();
    const message = {
      sender: user?._id,
      content: formData.get("message"),
      conversation: conversationId,
    };

    socket.emit("chat", message);
    setIsEmojiPickerOpen(false);
    setMessage("");
  };

  const handleFocus = () => {
    setIsEmojiPickerOpen(false);
    if (conversationId && messages.length) {
      socket.emit("readText", { _id: conversationId, userId: user?._id });
    }
  };

  useEffect(() => {
    if (socket && conversationId) {
      socket.emit("chat-room", { conversationId });
    }
  }, [conversationId, socket]);

  return (
    <Stack
      justifyContent="space-between"
      direction="column"
      height="85vh"
      p={2}
    >
      {conversationId ? (
        <>
          <Box
            height="100%"
            sx={{
              overflow: "auto",
              scrollBehavior: "smooth",
              display: "flex",
              flexDirection: "column-reverse",
            }}
            id="scrollableDiv"
          >
            <InfiniteScroll
              dataLength={messages.length}
              next={fetchMoreMessages}
              hasMore={hasMore}
              loader={
                <Stack
                  overflow="hidden"
                  direction="row"
                  justifyContent="center"
                >
                  <CircularProgress disableShrink size={30} />
                </Stack>
              }
              scrollableTarget="scrollableDiv" // Replace with the ID or ref of your scrollable container
              style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
              inverse={true}
            >
              {messages.map((message, index) => {
                const isUser = message.sender === user?._id;
                return (
                  <Message
                    key={message._id + index}
                    isUser={isUser}
                    message={message.content}
                  />
                );
              })}
            </InfiniteScroll>
          </Box>

          <Stack
            direction="row"
            component="form"
            onSubmit={handleSendMessage}
            sx={{ position: "relative" }}
          >
            <TextField
              fullWidth
              size="small"
              type="text"
              name="message"
              placeholder="Type a message"
              onFocus={handleFocus}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                margin: "auto",
                ":focus": {
                  borderColor: "primary.main",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    component={IconButton}
                    type="submit"
                    sx={{ width: 40, height: 40, borderRadius: "50%" }}
                  >
                    <SendIcon />
                  </InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment
                    position="end"
                    component={IconButton}
                    sx={{ width: 40, height: 40, borderRadius: "50%" }}
                    onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
                  >
                    <EmojiEmotionsIcon />
                  </InputAdornment>
                ),
              }}
            />
            {isEmojiPickerOpen && (
              <Box sx={{ position: "absolute", bottom: 50 }}>
                <EmojiPicker
                  searchDisabled
                  emojiStyle={EmojiStyle.FACEBOOK}
                  theme={
                    theme.palette.mode === "dark" ? Theme.DARK : Theme.LIGHT
                  }
                  lazyLoadEmojis={true}
                  onEmojiClick={(event) => {
                    setMessage((message) => message + event.emoji);
                  }}
                />
              </Box>
            )}
          </Stack>
        </>
      ) : (
        <Box height="100%">
          <Stack height="100%" justifyContent="center" alignItems="center">
            <ChatIcon
              sx={{
                fontSize: "5rem",
              }}
              height={200}
              color="primary"
            />
            <h3>Choose a conversation to start chatting</h3>
          </Stack>
        </Box>
      )}
    </Stack>
  );
}

export default ChatBox;
