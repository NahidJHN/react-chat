import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import Typography from "@mui/material/Typography";
import {
  Badge,
  Box,
  Fade,
  ListItemAvatar,
  ListItemButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import UserAvatar from "./UserAvater";
import Link from "../Link";

interface PropTypes {
  userName: string;
  lastMessage: string;
  time: string;
  userAvatar: string;
  isOnline: false;
  _id: string;
  isRead: boolean;
  open: boolean;
}

function UserList(props: PropTypes) {
  return (
    <Link
      component={Box}
      href={"?conversationId=" + props._id}
      variant="body2"
      sx={{ textDecoration: "none", color: "initial" }}
    >
      <Tooltip
        title={props.userName}
        placement="right"
        TransitionComponent={Fade}
      >
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: props.open ? "initial" : "center",
            }}
          >
            <ListItemAvatar
              sx={{
                minWidth: 0,
                mr: props.open ? 3 : "auto",
                justifyContent: "start",
              }}
            >
              <UserAvatar
                isOnline={props.isOnline}
                userAvatar={props.userAvatar}
                userName={props.userAvatar}
              />
            </ListItemAvatar>
            <ListItemText
              sx={{
                color: props.isRead ? "success.main" : "common.white",
                opacity: props.open ? 1 : 0,
              }}
              primary={props.userName}
              secondary={
                <Stack
                  direction="row"
                  spacing={4}
                  alignItems="center"
                  component="span"
                >
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color={props.isRead ? "grey.500" : "common.white"}
                  >
                    {props.lastMessage}
                  </Typography>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="grey.500"
                  >
                    {props.time}
                  </Typography>
                </Stack>
              }
            />
          </ListItemButton>
        </ListItem>
      </Tooltip>
    </Link>
  );
}

export default UserList;
