import { Box, IconButton, ListItemText, Stack } from "@mui/material";
import React from "react";
import CallIcon from "@mui/icons-material/CallOutlined";
import VideoCallIcon from "@mui/icons-material/VideoCallOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import UserAvatar from "./UserAvater";

dayjs.extend(relativeTime);

interface ChatBoxProps {
  userName: string;
  isOnline: boolean;
  lastActiveTime: string;
  avatar: string;
}

function ChatHeader(props: ChatBoxProps) {
  return (
    <Box sx={{ border: "1 px solid #ddd" }}>
      {props.userName && (
        <Stack direction="row" alignItems="center">
          <UserAvatar
            userAvatar={props.avatar}
            userName={props.userName}
            isOnline={props.isOnline}
          />
          <ListItemText
            sx={{ marginLeft: { xs: 1, md: 2 } }}
            primary={props.userName}
            secondary={
              props.isOnline
                ? "Active now"
                : dayjs(props.lastActiveTime).fromNow()
            }
          />
          <Stack
            direction="row"
            spacing={1}
            sx={{
              "& >*": {
                cursor: "pointer",
                color: "primary.main",
              },
            }}
          >
            <IconButton>
              <CallIcon />
            </IconButton>
            <IconButton onClick={() => {}}>
              <VideoCallIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Stack>
        </Stack>
      )}
    </Box>
  );
}

// function AudioSpeakerMenu({ setActiveAudioSpeaker, activeAudioSpeaker }: any) {
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const [audioDevices, setAudioDevices] = React.useState<MediaDeviceInfo[]>([]);

//   const open = Boolean(anchorEl);

//   const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuItemClick = (deviceId: string) => {
//     setActiveAudioSpeaker(deviceId);
//     setAnchorEl(null);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   useEffect(() => {
//     const getAudioDevices = async () => {
//       const devices = await navigator.mediaDevices.enumerateDevices();
//       const audioDevices = devices.filter(
//         (device) => device.kind === "audioinput"
//       );
//       setAudioDevices(audioDevices);
//       setActiveAudioSpeaker(audioDevices[0]);
//     };
//     getAudioDevices();
//   }, []);

//   return (
//     <>
//       <Button
//         variant="text"
//         id="input-audio-device-button"
//         aria-haspopup="listbox"
//         aria-controls="lock-menu"
//         aria-label="when device is locked"
//         aria-expanded={open ? "true" : undefined}
//         onClick={handleClickListItem}
//         startIcon={<MicNoneIcon />}
//       >
//         {activeAudioSpeaker?.label || "No audio device selected"}
//       </Button>
//       <Menu
//         id="input-audio-device"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         MenuListProps={{
//           "aria-labelledby": "input-audio-device",
//           role: "listbox",
//         }}
//       >
//         {audioDevices.map((option: MediaDeviceInfo) => (
//           <MenuItem
//             key={option.deviceId}
//             disabled={option.deviceId === "1"}
//             selected={option.deviceId === activeAudioSpeaker?.deviceId}
//             onClick={() => {
//               handleMenuItemClick(option.deviceId);
//             }}
//           >
//             {option.label}
//           </MenuItem>
//         ))}
//       </Menu>
//     </>
//   );
// }

export default ChatHeader;
