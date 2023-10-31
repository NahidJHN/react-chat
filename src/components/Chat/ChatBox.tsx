/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/SendOutlined";

import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { SocketContext } from "../../context/Socket.context";
import { useSearchParams } from "react-router-dom";
import Message from "../Message/Message";

type PropTypes = {
  user: any;
  messages: any[];
};

function ChatBox({ user, messages }: PropTypes) {
  const theme = useTheme();
  const boxRef = useRef<HTMLElement>(null);

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
    if (
      conversationId &&
      messages.length &&
      messages[messages.length - 1]?.sender !== user?._id
    ) {
      socket.emit("readText", { _id: conversationId, userId: user?._id });
    }
  };

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight + 500;
    }
  }, [messages]);

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
      <Box
        height="100%"
        sx={{
          overflowY: "auto",
          scrollBehavior: "smooth",
        }}
        ref={boxRef}
      >
        {messages.map((message) => {
          const isUser = message.sender === user?._id;
          if (message.conversation === conversationId) {
            return (
              <Message
                key={message._id}
                isUser={isUser}
                message={message.content}
              />
            );
          }
        })}
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
              theme={theme.palette.mode === "dark" ? Theme.DARK : Theme.LIGHT}
              lazyLoadEmojis={true}
              onEmojiClick={(event) => {
                setMessage((message) => message + event.emoji);
              }}
            />
          </Box>
        )}
      </Stack>
    </Stack>
  );
}

export default ChatBox;
