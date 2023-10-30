import {
  Avatar,
  Box,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface PropTypes {
  isUser: boolean;
  message: string;
}

function Message({ isUser, message }: PropTypes) {
  const [showIconButton, setShowIconButton] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Stack
      component={Box}
      width="100%"
      padding={2}
      justifyContent={isUser ? "flex-end" : "flex-start"}
      direction="row"
    >
      <Stack
        direction={isUser ? "row-reverse" : "row"}
        spacing={1}
        maxWidth="70%"
        justifyContent="end"
      >
        {!isUser && <Avatar></Avatar>}
        <Stack
          direction="row"
          onMouseEnter={() => setShowIconButton(true)}
          onMouseLeave={() => setShowIconButton(false)}
          alignItems="center"
        >
          <Typography
            variant="body2"
            bgcolor={isUser ? "primary.main" : "grey.300"}
            paddingX={2}
            paddingY={1}
            borderRadius={3}
            color={"primary.contrastText"}
            order={isUser ? 1 : 0}
          >
            {message}
          </Typography>
          {showIconButton && (
            <IconButton
              id="fade-menu-button"
              aria-controls={open ? "action-fade-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{ padding: 0, color: "action.active" }}
            >
              <MoreVertIcon />
            </IconButton>
          )}
          <Menu
            id="action-fade-menu"
            MenuListProps={{
              "aria-labelledby": "fade-menu-button",
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <MenuItem
              sx={{ paddingTop: 0, paddingBottom: 0 }}
              onClick={handleClose}
            >
              Unsent
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Message;
